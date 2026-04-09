import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserRole } from 'src/database/enums/user-role.enum';
import { Roles } from 'src/modules/utils/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/modules/utils/guards/jwt-auth.guard';
import { RolesGuard } from 'src/modules/utils/guards/roles.guard';
import { JwtGuardResponse } from 'src/modules/utils/guards/types/jwt-auth.interface';
import { Request } from 'express';
import { AuctionsService } from './auctions.service';
import {
  AuctionListQueryDto,
  CreateAuctionDto,
  UpdateAuctionDto,
} from './types/create-auction.dto';

type AuthenticatedRequest = Request & { user: JwtGuardResponse };

@ApiTags('Auctions')
@Controller('auctions')
export class AuctionsController {
  constructor(private readonly auctionsService: AuctionsService) {}

  @Get()
  listPublic(@Query() query: AuctionListQueryDto) {
    return this.auctionsService.listPublicAuctions(query);
  }

  @Get('mine/list')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.User, UserRole.Admin)
  listMine(@Req() req: AuthenticatedRequest) {
    return this.auctionsService.listSellerAuctions(req.user.id);
  }

  @Get('mine/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.User, UserRole.Admin)
  getMine(
    @Req() req: AuthenticatedRequest,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.auctionsService.getSellerAuction(req.user.id, id);
  }

  @Post('mine')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.User, UserRole.Admin)
  createMine(
    @Req() req: AuthenticatedRequest,
    @Body() dto: CreateAuctionDto,
  ) {
    return this.auctionsService.createAuction(req.user.id, dto);
  }

  @Patch('mine/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.User, UserRole.Admin)
  updateMine(
    @Req() req: AuthenticatedRequest,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateAuctionDto,
  ) {
    return this.auctionsService.updateAuction(req.user.id, id, dto);
  }

  @Post('mine/:id/publish')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.User, UserRole.Admin)
  publishMine(
    @Req() req: AuthenticatedRequest,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.auctionsService.publishAuction(req.user.id, id);
  }

  @Post('mine/:id/cancel')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.User, UserRole.Admin)
  cancelMine(
    @Req() req: AuthenticatedRequest,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.auctionsService.cancelAuction(req.user.id, id);
  }

  @Delete('mine/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.User, UserRole.Admin)
  deleteMine(
    @Req() req: AuthenticatedRequest,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.auctionsService.deleteAuction(req.user.id, id);
  }

  @Get(':id')
  getPublicOne(@Param('id', ParseIntPipe) id: number) {
    return this.auctionsService.getPublicAuction(id);
  }
}
