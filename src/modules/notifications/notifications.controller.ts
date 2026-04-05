import { Controller, Get } from '@nestjs/common';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  /**
   * Smoke test for the notifications module.
   * @returns { { ok: boolean; scope: string } }
   */
  @Get('test')
  getTest(): { ok: boolean; scope: string } {
    return { ok: true, scope: 'notifications' };
  }

  /**
   * Current user's notifications (stub).
   * @returns { { items: unknown[] } }
   */
  @Get()
  findMine(): { items: unknown[] } {
    return this.notificationsService.findMine();
  }
}
