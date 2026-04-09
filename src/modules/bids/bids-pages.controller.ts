import { Controller, Get, Header } from '@nestjs/common';
import { BidsUiService } from './bids-ui.service';

@Controller()
export class BidsPagesController {
  constructor(private readonly bidsUiService: BidsUiService) {}

  @Get('bids')
  @Header('Content-Type', 'text/html; charset=utf-8')
  getMyBidsPage(): string {
    return this.bidsUiService.getMyBidsPage();
  }
}
