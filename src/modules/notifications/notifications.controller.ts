import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
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
import { NotificationsService } from './notifications.service';

type AuthenticatedRequest = Request & { user: JwtGuardResponse };

@ApiTags('Notifications')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.Admin, UserRole.User)
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  getMine(@Req() req: AuthenticatedRequest) {
    return this.notificationsService.getMine(req.user.id);
  }

  @Get('summary')
  getSummary(@Req() req: AuthenticatedRequest) {
    return this.notificationsService.getSummary(req.user.id);
  }

  @Patch('read-all')
  markAllAsRead(@Req() req: AuthenticatedRequest) {
    return this.notificationsService.markAllAsRead(req.user.id);
  }

  @Patch(':id/read')
  markAsRead(
    @Req() req: AuthenticatedRequest,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.notificationsService.markAsRead(req.user.id, id);
  }
}
