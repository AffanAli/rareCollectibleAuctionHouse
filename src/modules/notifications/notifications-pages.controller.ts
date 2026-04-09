import { Controller, Get, Header } from '@nestjs/common';
import { NotificationsUiService } from './notifications-ui.service';

@Controller()
export class NotificationsPagesController {
  constructor(private readonly notificationsUiService: NotificationsUiService) {}

  @Get('notifications/page')
  @Header('Content-Type', 'text/html; charset=utf-8')
  getNotificationsPage(): string {
    return this.notificationsUiService.getNotificationsPage();
  }
}
