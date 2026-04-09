import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { UserRole } from 'src/database/enums/user-role.enum';
import { Roles } from 'src/modules/utils/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/modules/utils/guards/jwt-auth.guard';
import { RolesGuard } from 'src/modules/utils/guards/roles.guard';
import { JwtGuardResponse } from 'src/modules/utils/guards/types/jwt-auth.interface';
import { BidsService } from './bids.service';
import { CreateBidDto } from './types/create-bid.dto';

type AuthenticatedRequest = Request & { user: JwtGuardResponse };

@ApiTags('Bids')
@Controller()
export class BidsController {
  constructor(private readonly bidsService: BidsService) {}

  @Get('auctions/:auctionId/bids')
  getAuctionBids(@Param('auctionId', ParseIntPipe) auctionId: number) {
    return this.bidsService.getAuctionBids(auctionId);
  }

  @Post('auctions/:auctionId/bids')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.User, UserRole.Admin)
  placeBid(
    @Req() req: AuthenticatedRequest,
    @Param('auctionId', ParseIntPipe) auctionId: number,
    @Body() dto: CreateBidDto,
  ) {
    return this.bidsService.placeBid(req.user.id, auctionId, dto);
  }

  @Get('users/me/bids')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.User, UserRole.Admin)
  getMyBids(@Req() req: AuthenticatedRequest) {
    return this.bidsService.getMyBids(req.user.id);
  }
}
