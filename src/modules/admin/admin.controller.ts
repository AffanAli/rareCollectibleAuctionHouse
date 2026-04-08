import { Controller, Get, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/utils/guards/jwt-auth.guard';
import { User } from 'src/database/entities';

@Controller('admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('users')
  listUsers(): Promise<User[]> {
    return this.adminService.listUsers();
  }

  // /**
  //  * @returns { { items: unknown[]; resource: string } }
  //  */
  // @Get('auctions')
  // listAuctions(): { items: unknown[]; resource: string } {
  //   return this.adminService.listResource('auctions');
  // }

  // /**
  //  * @returns { { items: unknown[]; resource: string } }
  //  */
  // @Get('bids')
  // listBids(): { items: unknown[]; resource: string } {
  //   return this.adminService.listResource('bids');
  // }

  // /**
  //  * @returns { { items: unknown[]; resource: string } }
  //  */
  // @Get('messages')
  // listMessages(): { items: unknown[]; resource: string } {
  //   return this.adminService.listResource('messages');
  // }

  // /**
  //  * @returns { { items: unknown[]; resource: string } }
  //  */
  // @Get('notifications')
  // listNotifications(): { items: unknown[]; resource: string } {
  //   return this.adminService.listResource('notifications');
  // }

  // /**
  //  * @returns { { items: unknown[]; resource: string } }
  //  */
  // @Get('disputes')
  // listDisputes(): { items: unknown[]; resource: string } {
  //   return this.adminService.listResource('disputes');
  // }

  // /**
  //  * @returns { { items: unknown[]; resource: string } }
  //  */
  // @Get('payments')
  // listPayments(): { items: unknown[]; resource: string } {
  //   return this.adminService.listResource('payments');
  // }
}
