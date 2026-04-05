import { Controller, Get } from '@nestjs/common';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  /**
   * Smoke test for admin routes (add role guard later).
   * @returns { { ok: boolean; scope: string } }
   */
  @Get('test')
  getTest(): { ok: boolean; scope: string } {
    return { ok: true, scope: 'admin' };
  }

  /**
   * @returns { { items: unknown[]; resource: string } }
   */
  @Get('users')
  listUsers(): { items: unknown[]; resource: string } {
    return this.adminService.listResource('users');
  }

  /**
   * @returns { { items: unknown[]; resource: string } }
   */
  @Get('auctions')
  listAuctions(): { items: unknown[]; resource: string } {
    return this.adminService.listResource('auctions');
  }

  /**
   * @returns { { items: unknown[]; resource: string } }
   */
  @Get('bids')
  listBids(): { items: unknown[]; resource: string } {
    return this.adminService.listResource('bids');
  }

  /**
   * @returns { { items: unknown[]; resource: string } }
   */
  @Get('messages')
  listMessages(): { items: unknown[]; resource: string } {
    return this.adminService.listResource('messages');
  }

  /**
   * @returns { { items: unknown[]; resource: string } }
   */
  @Get('notifications')
  listNotifications(): { items: unknown[]; resource: string } {
    return this.adminService.listResource('notifications');
  }

  /**
   * @returns { { items: unknown[]; resource: string } }
   */
  @Get('disputes')
  listDisputes(): { items: unknown[]; resource: string } {
    return this.adminService.listResource('disputes');
  }

  /**
   * @returns { { items: unknown[]; resource: string } }
   */
  @Get('payments')
  listPayments(): { items: unknown[]; resource: string } {
    return this.adminService.listResource('payments');
  }
}
