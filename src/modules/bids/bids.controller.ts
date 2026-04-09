// import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
// import { BidsService } from './bids.service';
// import { CreateBidDto } from './dto/create-bid.dto';
// import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
// import { UserRole } from 'src/database/enums/user-role.enum';
// import { Roles } from 'src/modules/utils/decorators/roles.decorator';
// import { JwtAuthGuard } from 'src/modules/utils/guards/jwt-auth.guard';
// import { RolesGuard } from 'src/modules/utils/guards/roles.guard';

// @ApiTags('Auction Bid')
// @ApiBearerAuth()
// @UseGuards(JwtAuthGuard, RolesGuard)
// @Roles(UserRole.User)
// @Controller('auctions/:auctionId/bids')
// export class AuctionBidsController {
//   constructor(private readonly bidsService: BidsService) {}

//   @Post()
//   create(
//     @Param('auctionId') auctionId: string,
//     @Body() dto: CreateBidDto,
//   ): { message: string } {
//     return this.bidsService.create(auctionId, dto);
//   }
// }
