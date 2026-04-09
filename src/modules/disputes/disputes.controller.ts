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
import { DisputesService } from './disputes.service';
import { CreateDisputeDto } from './types/dispute.dto';

type AuthenticatedRequest = Request & { user: JwtGuardResponse };

@ApiTags('Disputes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.User, UserRole.Admin)
@Controller('disputes')
export class DisputesController {
  constructor(private readonly disputesService: DisputesService) {}

  @Get('mine')
  getMine(@Req() req: AuthenticatedRequest) {
    return this.disputesService.getMyDisputes(req.user.id);
  }

  @Get('eligible-auctions')
  getEligibleAuctions(@Req() req: AuthenticatedRequest) {
    return this.disputesService.listEligibleAuctions(req.user.id);
  }

  @Get(':id')
  getOne(
    @Req() req: AuthenticatedRequest,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.disputesService.getDisputeForUser(req.user.id, req.user.role, id);
  }

  @Post()
  create(
    @Req() req: AuthenticatedRequest,
    @Body() dto: CreateDisputeDto,
  ) {
    return this.disputesService.createDispute(req.user.id, dto);
  }
}
