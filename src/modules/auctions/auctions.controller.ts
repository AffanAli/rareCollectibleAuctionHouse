import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AuctionsService } from './auctions.service';
import { CreateAuctionDto } from './dto/create-auction.dto';

@Controller('auctions')
export class AuctionsController {
  constructor(private readonly auctionsService: AuctionsService) {}

  /**
   * Smoke test for the auctions module.
   * @returns { { ok: boolean; scope: string } }
   */
  @Get('test')
  getTest(): { ok: boolean; scope: string } {
    return { ok: true, scope: 'auctions' };
  }

  /**
   * List available auctions (stub).
   * @returns { { items: unknown[] } }
   */
  @Get()
  findAll(): { items: unknown[] } {
    return this.auctionsService.findAll();
  }

  /**
   * Create a new auction (stub).
   * @param { CreateAuctionDto } dto - Body.
   * @returns { { message: string; id: string } }
   */
  @Post()
  create(@Body() dto: CreateAuctionDto): { message: string; id: string } {
    return this.auctionsService.create(dto);
  }

  /**
   * Auction details (stub). Dynamic route last among GETs for this controller.
   * @param { string } id - Auction id.
   * @returns { Record<string, unknown> }
   */
  @Get(':id')
  findOne(@Param('id') id: string): Record<string, unknown> {
    return this.auctionsService.findOne(id);
  }
}
