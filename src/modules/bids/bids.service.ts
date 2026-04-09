import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuctionStatus } from '../../database/enums/auction-status.enum';
import { Auction, Bid, Notification } from '../../database/entities';
import { CreateBidDto } from './types/create-bid.dto';

type AuctionBidResponse = {
  id: number;
  amount: number;
  createdAt: Date;
  bidder: {
    id: number;
    displayName: string;
  };
  auction: {
    id: number;
    title: string;
  };
};

type AuctionBidSummaryResponse = {
  auctionId: number;
  currentHighBid: AuctionBidResponse | null;
  minimumNextBid: number;
  totalBids: number;
  recentBids: AuctionBidResponse[];
};

@Injectable()
export class BidsService {
  constructor(
    @InjectRepository(Bid)
    private readonly bidsRepo: Repository<Bid>,
    @InjectRepository(Auction)
    private readonly auctionsRepo: Repository<Auction>,
    @InjectRepository(Notification)
    private readonly notificationsRepo: Repository<Notification>,
  ) {}

  async placeBid(
    userId: number,
    auctionId: number,
    dto: CreateBidDto,
  ): Promise<AuctionBidSummaryResponse> {
    const auction = await this.auctionsRepo.findOne({
      where: { id: auctionId },
      relations: {
        seller: true,
        currentHighBid: { bidder: true, auction: true },
      },
    });

    if (!auction || auction.deletedAt) {
      throw new NotFoundException('Auction not found');
    }

    if (auction.status !== AuctionStatus.Active) {
      throw new BadRequestException('Bidding is only available on active auctions');
    }

    const now = new Date();
    if (now < auction.startsAt || now > auction.endsAt) {
      throw new BadRequestException('This auction is not currently accepting bids');
    }

    if (auction.seller.id === userId) {
      throw new BadRequestException('Sellers cannot bid on their own auctions');
    }

    const minimumNextBid = this.calculateMinimumNextBid(auction);
    if (dto.amount < minimumNextBid) {
      throw new BadRequestException(
        `Bid must be at least ${minimumNextBid.toFixed(2)}`,
      );
    }

    const previousHighBid = auction.currentHighBid;

    const bid = await this.bidsRepo.save(
      this.bidsRepo.create({
        amount: dto.amount,
        bidder: { id: userId } as Bid['bidder'],
        auction: { id: auctionId } as Bid['auction'],
      }),
    );

    auction.currentHighBid = bid;
    await this.auctionsRepo.save(auction);

    if (
      previousHighBid &&
      previousHighBid.bidder &&
      previousHighBid.bidder.id !== userId
    ) {
      await this.notificationsRepo.save(
        this.notificationsRepo.create({
          user: { id: previousHighBid.bidder.id } as Notification['user'],
          type: 'OUTBID',
          title: 'You have been outbid',
          body: `Another bidder has placed a higher bid on "${auction.title}".`,
          payloadJson: {
            auctionId: auction.id,
            newBidAmount: dto.amount,
          },
          auction: { id: auction.id } as Notification['auction'],
        }),
      );
    }

    return this.getAuctionBids(auctionId);
  }

  async getAuctionBids(auctionId: number): Promise<AuctionBidSummaryResponse> {
    const auction = await this.auctionsRepo.findOne({
      where: { id: auctionId },
      relations: {
        currentHighBid: { bidder: true, auction: true },
      },
    });

    if (!auction || auction.deletedAt) {
      throw new NotFoundException('Auction not found');
    }

    const bids = await this.bidsRepo.find({
      where: { auction: { id: auctionId } },
      relations: { bidder: true, auction: true },
      order: { amount: 'DESC', createdAt: 'DESC' },
    });

    const activeBids = bids.filter((bid) => !bid.deletedAt);

    return {
      auctionId,
      currentHighBid: auction.currentHighBid
        ? this.toBidResponse(auction.currentHighBid)
        : null,
      minimumNextBid: this.calculateMinimumNextBid(auction),
      totalBids: activeBids.length,
      recentBids: activeBids.slice(0, 10).map((bid) => this.toBidResponse(bid)),
    };
  }

  async getMyBids(userId: number): Promise<AuctionBidResponse[]> {
    const bids = await this.bidsRepo.find({
      where: { bidder: { id: userId } },
      relations: { bidder: true, auction: true },
      order: { createdAt: 'DESC' },
    });

    return bids
      .filter((bid) => !bid.deletedAt)
      .map((bid) => this.toBidResponse(bid));
  }

  private calculateMinimumNextBid(auction: Auction): number {
    const currentAmount =
      auction.currentHighBid?.amount ?? auction.startingPrice;
    return Number((currentAmount + 1).toFixed(2));
  }

  private toBidResponse(bid: Bid): AuctionBidResponse {
    return {
      id: bid.id,
      amount: bid.amount,
      createdAt: bid.createdAt,
      bidder: {
        id: bid.bidder.id,
        displayName: bid.bidder.displayName || `Bidder #${bid.bidder.id}`,
      },
      auction: {
        id: bid.auction.id,
        title: bid.auction.title,
      },
    };
  }
}
