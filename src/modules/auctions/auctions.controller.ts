import * as crud from '@nestjsx/crud';
import { Auction } from 'src/database/entities';

import { AuctionsService } from './auctions.service';
import { Controller, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/utils/guards/jwt-auth.guard';
import {
  CreateAuctionDto,
  UpdateAuctionDto,
} from 'src/modules/auctions/dto/create-auction.dto';

@crud.Crud({
  model: { type: Auction },
  routes: {
    exclude: ['replaceOneBase', 'deleteOneBase', 'createManyBase'],
  },
})
@ApiTags('Auctions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('auctions')
export class AuctionsController {
  constructor(public readonly service: AuctionsService) {}

  get base(): crud.CrudController<Auction> {
    return this;
  }

  @crud.Override('getOneBase')
  getOne(@crud.ParsedRequest() req: crud.CrudRequest) {
    return this.base?.getOneBase?.(req);
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
