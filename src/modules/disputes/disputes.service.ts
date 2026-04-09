import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Auction,
  Dispute,
  Notification,
} from '../../database/entities';
import { AuctionStatus } from '../../database/enums/auction-status.enum';
import { UserRole } from '../../database/enums/user-role.enum';
import { DisputeStatus } from '../../database/enums/dispute-status.enum';
import { Repository } from 'typeorm';
import { CreateDisputeDto, ResolveDisputeDto } from './types/dispute.dto';

@Injectable()
export class DisputesService {
  constructor(
    @InjectRepository(Dispute)
    private readonly disputesRepo: Repository<Dispute>,
    @InjectRepository(Auction)
    private readonly auctionsRepo: Repository<Auction>,
    @InjectRepository(Notification)
    private readonly notificationsRepo: Repository<Notification>,
  ) {}

  async createDispute(userId: number, dto: CreateDisputeDto) {
    const auction = await this.auctionsRepo.findOne({
      where: { id: dto.auctionId },
      relations: { seller: true, winningBid: { bidder: true } },
    });

    if (!auction || auction.deletedAt) {
      throw new NotFoundException('Auction not found');
    }

    if (auction.status !== AuctionStatus.Ended) {
      throw new BadRequestException(
        'Disputes can only be opened for ended auctions',
      );
    }

    const isSeller = auction.seller.id === userId;
    const isWinningBidder = auction.winningBid?.bidder?.id === userId;

    if (!isSeller && !isWinningBidder) {
      throw new ForbiddenException(
        'Only the seller or winning bidder can raise a dispute',
      );
    }

    const dispute = await this.disputesRepo.save(
      this.disputesRepo.create({
        auction: { id: dto.auctionId } as Dispute['auction'],
        raisedBy: { id: userId } as Dispute['raisedBy'],
        description: dto.description.trim(),
        evidenceUrl: dto.evidenceUrl ?? null,
        status: DisputeStatus.Open,
      }),
    );

    const recipients = new Set<number>([auction.seller.id]);
    if (auction.winningBid?.bidder?.id) {
      recipients.add(auction.winningBid.bidder.id);
    }
    recipients.delete(userId);

    if (recipients.size > 0) {
      await this.notificationsRepo.save(
        Array.from(recipients).map((recipientId) =>
          this.notificationsRepo.create({
            user: { id: recipientId } as Notification['user'],
            type: 'DISPUTE_OPENED',
            title: `Dispute opened for "${auction.title}"`,
            body: dto.description.trim().slice(0, 180),
            payloadJson: { auctionId: dto.auctionId, disputeId: dispute.id },
            auction: { id: dto.auctionId } as Notification['auction'],
          }),
        ),
      );
    }

    return this.getDispute(dispute.id);
  }

  async getDispute(id: number) {
    const dispute = await this.disputesRepo.findOne({
      where: { id },
      relations: {
        auction: { seller: true, winningBid: { bidder: true } },
        raisedBy: true,
        resolvedBy: true,
      },
    });

    if (!dispute || dispute.deletedAt) {
      throw new NotFoundException('Dispute not found');
    }

    return dispute;
  }

  async getDisputeForUser(userId: number, role: UserRole, id: number) {
    const dispute = await this.getDispute(id);

    if (role === UserRole.Admin) {
      return dispute;
    }

    const isRaisedByUser = dispute.raisedBy.id === userId;
    const isSeller = dispute.auction.seller?.id === userId;
    const isWinningBidder = dispute.auction.winningBid?.bidder?.id === userId;

    if (!isRaisedByUser && !isSeller && !isWinningBidder) {
      throw new ForbiddenException('You do not have access to this dispute');
    }

    return dispute;
  }

  async getMyDisputes(userId: number) {
    const disputes = await this.disputesRepo.find({
      relations: {
        auction: { seller: true, winningBid: { bidder: true } },
        raisedBy: true,
        resolvedBy: true,
      },
      order: { createdAt: 'DESC' },
    });

    return disputes.filter((dispute) => {
      if (dispute.deletedAt) {
        return false;
      }

      return (
        dispute.raisedBy.id === userId ||
        dispute.auction.seller?.id === userId ||
        dispute.auction.winningBid?.bidder?.id === userId
      );
    });
  }

  async getAllDisputes() {
    return this.disputesRepo.find({
      relations: {
        auction: { seller: true, winningBid: { bidder: true } },
        raisedBy: true,
        resolvedBy: true,
      },
      order: { createdAt: 'DESC' },
    });
  }

  async resolveDispute(
    adminUserId: number,
    disputeId: number,
    dto: ResolveDisputeDto,
  ) {
    const dispute = await this.getDispute(disputeId);

    dispute.status = dto.status;
    dispute.resolution = dto.resolution ?? null;
    dispute.resolutionNotes = dto.resolutionNotes?.trim() || null;
    dispute.resolvedBy = { id: adminUserId } as Dispute['resolvedBy'];
    dispute.resolvedAt = new Date();

    await this.disputesRepo.save(dispute);

    const recipients = new Set<number>([
      dispute.raisedBy.id,
      dispute.auction.seller.id,
    ]);

    if (dispute.auction.winningBid?.bidder?.id) {
      recipients.add(dispute.auction.winningBid.bidder.id);
    }

    await this.notificationsRepo.save(
      Array.from(recipients).map((recipientId) =>
        this.notificationsRepo.create({
          user: { id: recipientId } as Notification['user'],
          type: 'DISPUTE_RESOLVED',
          title: `Dispute updated for "${dispute.auction.title}"`,
          body:
            dispute.resolutionNotes ||
            'An administrator has reviewed and updated your dispute.',
          payloadJson: {
            disputeId: dispute.id,
            auctionId: dispute.auction.id,
            status: dispute.status,
            resolution: dispute.resolution,
          },
          auction: { id: dispute.auction.id } as Notification['auction'],
        }),
      ),
    );

    return this.getDispute(disputeId);
  }

  async listEligibleAuctions(userId: number) {
    const auctions = await this.auctionsRepo.find({
      relations: {
        seller: true,
        winningBid: { bidder: true },
      },
      order: { updatedAt: 'DESC' },
    });

    return auctions.filter((auction) => {
      if (auction.deletedAt || auction.status !== AuctionStatus.Ended) {
        return false;
      }

      return (
        auction.seller.id === userId ||
        auction.winningBid?.bidder?.id === userId
      );
    });
  }
}
