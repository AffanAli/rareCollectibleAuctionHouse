import { Injectable } from '@nestjs/common';
import { CreateBidDto } from './dto/create-bid.dto';

@Injectable()
export class BidsService {
  /**
   * Stub: bids for one auction.
   * @param { string } auctionId - Auction id.
   * @returns { { items: unknown[]; auctionId: string } }
   */
  findForAuction(auctionId: string): { items: unknown[]; auctionId: string } {
    return { items: [], auctionId };
  }

  /**
   * Stub: place a bid.
   * @param { string } auctionId - Auction id.
   * @param { CreateBidDto } dto - Bid body.
   * @returns { { message: string } }
   */
  create(auctionId: string, dto: CreateBidDto): { message: string } {
    return {
      message: `TODO: validate auction open and amount > current; persist bid (${auctionId}, ${dto.amount})`,
    };
  }

  /**
   * Stub: current user's bids across auctions.
   * @returns { { items: unknown[] } }
   */
  findMine(): { items: unknown[] } {
    return { items: [] };
  }
}
