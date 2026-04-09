import * as crud from '@nestjsx/crud';
import { Controller, UseGuards } from '@nestjs/common';
import { DisputesService } from './disputes.service';
import { Dispute } from 'src/database/entities';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { UserRole } from 'src/database/enums/user-role.enum';
import { Roles } from 'src/modules/utils/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/modules/utils/guards/jwt-auth.guard';
import { RolesGuard } from 'src/modules/utils/guards/roles.guard';
import { CreateDisputeDto, UpdateDisputeDto } from './types/dispute.dto';

@crud.Crud({
  model: { type: Dispute },
  dto: {
    create: CreateDisputeDto,
    update: UpdateDisputeDto,
  },
  routes: {
    exclude: ['replaceOneBase', 'deleteOneBase', 'createManyBase'],
  },
})
@ApiTags('Disputes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.User, UserRole.Admin)
@Controller('disputes')
export class DisputesController {
  constructor(readonly service: DisputesService) {}

  get base(): crud.CrudController<Dispute> {
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

  @crud.Override('createOneBase')
  async createOne(
    @crud.ParsedRequest() req: crud.CrudRequest,
    @crud.ParsedBody() dto: CreateDisputeDto,
  ) {
    return this.base?.createOneBase?.(req, {
      ...dto,
    } as unknown as Dispute);
  }

  @crud.Override('updateOneBase')
  updateOne(
    @crud.ParsedRequest() req: crud.CrudRequest,
    @crud.ParsedBody() dto: UpdateDisputeDto,
  ) {
    return this.base?.updateOneBase?.(req, dto as unknown as Dispute);
  }
}
