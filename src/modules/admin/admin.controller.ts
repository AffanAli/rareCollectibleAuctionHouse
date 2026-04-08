import { Controller, Get, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/utils/guards/jwt-auth.guard';
import { User } from 'src/database/entities';
import { RolesGuard } from 'src/modules/utils/guards/roles.guard';
import { UserRole } from 'src/database/enums/user-role.enum';
import { Roles } from 'src/modules/utils/decorators/roles.decorator';

@Controller('admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.Admin)
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
