import * as crud from '@nestjsx/crud';
import { Message } from 'src/database/entities';
import { MessagesService } from './messages.service';
import { Controller, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { UserRole } from 'src/database/enums/user-role.enum';
import { RolesGuard } from 'src/modules/utils/guards/roles.guard';
import { Roles } from 'src/modules/utils/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/modules/utils/guards/jwt-auth.guard';

@crud.Crud({
  model: { type: Message },
  routes: {
    only: ['getManyBase', 'getOneBase'],
  },
})
@ApiTags('Messages')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.Admin, UserRole.User)
@Controller('messages')
export class MessagesController {
  constructor(public readonly service: MessagesService) {}

  get base(): crud.CrudController<Message> {
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
