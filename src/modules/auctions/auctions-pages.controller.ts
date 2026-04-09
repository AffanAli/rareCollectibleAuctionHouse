import { Controller, Get, Header, Param, ParseIntPipe } from '@nestjs/common';
import { AuctionsUiService } from './auctions-ui.service';

@Controller()
export class AuctionsPagesController {
  constructor(private readonly auctionsUiService: AuctionsUiService) {}

  @Get('marketplace')
  @Header('Content-Type', 'text/html; charset=utf-8')
  getMarketplacePage(): string {
    return this.auctionsUiService.getMarketplacePage();
  }

  @Get('marketplace/:id')
  @Header('Content-Type', 'text/html; charset=utf-8')
  getMarketplaceAuctionPage(@Param('id', ParseIntPipe) id: number): string {
    return this.auctionsUiService.getMarketplaceAuctionPage(id);
  }

  @Get('seller/auctions')
  @Header('Content-Type', 'text/html; charset=utf-8')
  getSellerAuctionsPage(): string {
    return this.auctionsUiService.getSellerAuctionsPage();
  }

  @Get('seller/auctions/new')
  @Header('Content-Type', 'text/html; charset=utf-8')
  getSellerAuctionNewPage(): string {
    return this.auctionsUiService.getSellerAuctionEditorPage();
  }

  @Get('seller/auctions/:id/edit')
  @Header('Content-Type', 'text/html; charset=utf-8')
  getSellerAuctionEditPage(@Param('id', ParseIntPipe) id: number): string {
    return this.auctionsUiService.getSellerAuctionEditorPage(id);
  }
}
