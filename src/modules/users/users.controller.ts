import { Body, Controller, Get, Patch } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Smoke test for the users module.
   * @returns { { ok: boolean; scope: string } }
   */
  @Get('test')
  getTest(): { ok: boolean; scope: string } {
    return { ok: true, scope: 'users' };
  }

  /**
   * Current user profile (stub).
   * @returns { Record<string, unknown> }
   */
  @Get('me')
  getMe(): Record<string, unknown> {
    return this.usersService.getMe();
  }

  /**
   * Update current user profile (stub).
   * @param { Record<string, unknown> } body - Updatable fields.
   * @returns { Record<string, unknown> }
   */
  @Patch('me')
  updateMe(@Body() body: Record<string, unknown>): Record<string, unknown> {
    return this.usersService.updateMe(body);
  }

  /**
   * Auction history for the current user (stub).
   * @returns { { items: unknown[] } }
   */
  @Get('me/auction-history')
  getMyAuctionHistory(): { items: unknown[] } {
    return this.usersService.getMyAuctionHistory();
  }
}
