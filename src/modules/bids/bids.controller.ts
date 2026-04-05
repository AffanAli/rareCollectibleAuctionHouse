import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { BidsService } from './bids.service';
import { CreateBidDto } from './dto/create-bid.dto';

/**
 * Nested REST resource: /auctions/:auctionId/bids
 */
@Controller('auctions/:auctionId/bids')
export class AuctionBidsController {
  constructor(private readonly bidsService: BidsService) {}

  /**
   * List bids for an auction (stub).
   * @param { string } auctionId - Auction id.
   * @returns { { items: unknown[] } }
   */
  @Get()
  findForAuction(
    @Param('auctionId') auctionId: string,
  ): { items: unknown[]; auctionId: string } {
    return this.bidsService.findForAuction(auctionId);
  }

  /**
   * Place a bid (stub).
   * @param { string } auctionId - Auction id.
   * @param { CreateBidDto } dto - Bid amount.
   * @returns { { message: string } }
   */
  @Post()
  create(
    @Param('auctionId') auctionId: string,
    @Body() dto: CreateBidDto,
  ): { message: string } {
    return this.bidsService.create(auctionId, dto);
  }
}
