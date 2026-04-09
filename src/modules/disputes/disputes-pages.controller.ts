import { Controller, Get, Header } from '@nestjs/common';
import { DisputesUiService } from './disputes-ui.service';

@Controller()
export class DisputesPagesController {
  constructor(private readonly disputesUiService: DisputesUiService) {}

  @Get('disputes')
  @Header('Content-Type', 'text/html; charset=utf-8')
  getDisputesPage(): string {
    return this.disputesUiService.getDisputesPage();
  }
}
