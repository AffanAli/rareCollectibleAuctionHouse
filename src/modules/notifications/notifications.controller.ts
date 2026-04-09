import * as crud from '@nestjsx/crud';
import { Notification } from 'src/database/entities';
import { Controller, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { UserRole } from 'src/database/enums/user-role.enum';
import { NotificationsService } from './notifications.service';
import { RolesGuard } from 'src/modules/utils/guards/roles.guard';
import { Roles } from 'src/modules/utils/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/modules/utils/guards/jwt-auth.guard';

@crud.Crud({
  model: { type: Notification },
  routes: {
    only: ['getManyBase', 'getOneBase'],
  },
})
@ApiTags('Notification')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.Admin, UserRole.User)
@Controller('notifications')
export class NotificationsController {
  constructor(public readonly service: NotificationsService) {}

  get base(): crud.CrudController<Notification> {
    return this;
  }

  @crud.Override('getOneBase')
  getOne(@crud.ParsedRequest() req: crud.CrudRequest) {
    return this.base?.getOneBase?.(req);
  }

  @crud.Override('getManyBase')
  getMany(@crud.ParsedRequest() req: crud.CrudRequest) {
    return this.base?.getManyBase?.(req);
  }
}
