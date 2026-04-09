import { Controller, Get, Header } from '@nestjs/common';
import { AdminUiService } from './admin-ui.service';

@Controller()
export class AdminPagesController {
  constructor(private readonly adminUiService: AdminUiService) {}

  @Get('admin/dashboard')
  @Header('Content-Type', 'text/html; charset=utf-8')
  getDashboardPage(): string {
    return this.adminUiService.getDashboardPage();
  }
}
