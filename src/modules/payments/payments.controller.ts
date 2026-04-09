import * as crud from '@nestjsx/crud';
import { Controller, UseGuards } from '@nestjs/common';
import { Payment } from 'src/database/entities';
import { PaymentsService } from './payments.service';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { UserRole } from 'src/database/enums/user-role.enum';
import { Roles } from 'src/modules/utils/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/modules/utils/guards/jwt-auth.guard';
import { RolesGuard } from 'src/modules/utils/guards/roles.guard';

@crud.Crud({
  model: { type: Payment },
  routes: {
    only: ['getManyBase', 'getOneBase'],
  },
})
@ApiTags('Payments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.Admin, UserRole.User)
@Controller('payments')
export class PaymentsController {
  constructor(public readonly service: PaymentsService) {}

  get base(): crud.CrudController<Payment> {
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
