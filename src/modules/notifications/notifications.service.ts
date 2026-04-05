import { Injectable } from '@nestjs/common';

@Injectable()
export class NotificationsService {
  /**
   * Stub: notifications for the current user.
   * @returns { { items: unknown[] } }
   */
  findMine(): { items: unknown[] } {
    return { items: [] };
  }
}
