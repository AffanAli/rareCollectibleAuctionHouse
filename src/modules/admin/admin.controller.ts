import { Body, Controller, Get, Param, ParseIntPipe, Patch, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/utils/guards/jwt-auth.guard';
import { RolesGuard } from 'src/modules/utils/guards/roles.guard';
import { UserRole } from 'src/database/enums/user-role.enum';
import { Roles } from 'src/modules/utils/decorators/roles.decorator';
import { DisputesService } from 'src/modules/disputes/disputes.service';
import { ResolveDisputeDto } from 'src/modules/disputes/types/dispute.dto';
import { Req } from '@nestjs/common';
import { Request } from 'express';
import { JwtGuardResponse } from 'src/modules/utils/guards/types/jwt-auth.interface';
import { PaymentsService } from 'src/modules/payments/payments.service';
import {
  UpdateAuctionStatusDto,
  UpdateUserStatusDto,
} from './types/admin.dto';

type AuthenticatedRequest = Request & { user: JwtGuardResponse };

@Controller('admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.Admin)
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly disputesService: DisputesService,
    private readonly paymentsService: PaymentsService,
  ) {}

  @Get('dashboard')
  getDashboard() {
    return this.adminService.getDashboard();
  }

  @Get('users')
  listUsers() {
    return this.adminService.listUsers();
  }

  @Patch('users/:id/status')
  updateUserStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUserStatusDto,
  ) {
    return this.adminService.updateUserStatus(id, dto.isActive);
  }

  @Get('auctions')
  listAuctions() {
    return this.adminService.listAuctions();
  }

  @Patch('auctions/:id/status')
  updateAuctionStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateAuctionStatusDto,
  ) {
    return this.adminService.updateAuctionStatus(id, dto.status);
  }

  @Get('bids')
  listBids() {
    return this.adminService.listBids();
  }

  @Get('messages')
  listMessages() {
    return this.adminService.listMessages();
  }

  @Get('notifications')
  listNotifications() {
    return this.adminService.listNotifications();
  }

  @Get('disputes')
  listDisputes() {
    return this.disputesService.getAllDisputes();
  }

  @Patch('disputes/:id/resolve')
  resolveDispute(
    @Req() req: AuthenticatedRequest,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ResolveDisputeDto,
  ) {
    return this.disputesService.resolveDispute(req.user.id, id, dto);
  }

  @Get('payments')
  listPayments() {
    return this.paymentsService.getAdminPayments();
  }
}
