import * as crud from '@nestjsx/crud';
import { Auction } from 'src/database/entities';

import { AuctionsService } from './auctions.service';
import { Controller, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/utils/guards/jwt-auth.guard';
import { CreateAuctionDto, UpdateAuctionDto } from './types/create-auction.dto';
import { UserRole } from 'src/database/enums/user-role.enum';
import { Roles } from 'src/modules/utils/decorators/roles.decorator';
import { RolesGuard } from 'src/modules/utils/guards/roles.guard';

@crud.Crud({
  model: { type: Auction },
  dto: {
    create: CreateAuctionDto,
    update: UpdateAuctionDto,
  },
  routes: {
    exclude: ['replaceOneBase', 'deleteOneBase', 'createManyBase'],
  },
})
@ApiTags('Auctions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.Admin)
@Controller('auctions')
export class AuctionsController {
  constructor(public readonly service: AuctionsService) {}

  get base(): crud.CrudController<Auction> {
    return this;
  }

  @crud.Override('getOneBase')
  getOne(@crud.ParsedRequest() req: crud.CrudRequest) {
    return this.service.repo.findOne({
      where: { id: req.parsed.paramsFilter[0].value },
      relations: ['seller', 'images', 'bids'],
    });
  }

  @crud.Override('createOneBase')
  async createOne(
    @crud.ParsedRequest() req: crud.CrudRequest,
    @crud.ParsedBody() dto: CreateAuctionDto,
  ) {
    return this.base?.createOneBase?.(req, dto as unknown as Auction);
  }

  @crud.Override('updateOneBase')
  updateOne(
    @crud.ParsedRequest() req: crud.CrudRequest,
    @crud.ParsedBody() dto: UpdateAuctionDto,
  ) {
    return this.base?.updateOneBase?.(req, dto as unknown as Auction);
  }
}
