import * as crud from '@nestjsx/crud';
import { Bid } from 'src/database/entities';

import { Controller, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/utils/guards/jwt-auth.guard';
import { UserRole } from 'src/database/enums/user-role.enum';
import { Roles } from 'src/modules/utils/decorators/roles.decorator';
import { RolesGuard } from 'src/modules/utils/guards/roles.guard';
import { BidsService } from 'src/modules/bids/bids.service';
import { CreateBidDto } from 'src/modules/bids/types/create-bid.dto';

@crud.Crud({
  model: { type: Bid },
  routes: {
    exclude: [
      'replaceOneBase',
      'deleteOneBase',
      'createManyBase',
      'updateOneBase',
    ],
  },
})
@ApiTags('Bid')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.User)
@Controller('bid')
export class BidsProbeController {
  constructor(public readonly service: BidsService) {}

  get base(): crud.CrudController<Bid> {
    return this;
  }

  @crud.Override('getOneBase')
  getOne(@crud.ParsedRequest() req: crud.CrudRequest) {
    return this.base?.getOneBase?.(req);
  }

  @crud.Override('createOneBase')
  async createOne(
    @crud.ParsedRequest() req: crud.CrudRequest,
    @crud.ParsedBody() dto: CreateBidDto,
  ) {
    return this.base?.createOneBase?.(req, dto as unknown as Bid);
  }
}
