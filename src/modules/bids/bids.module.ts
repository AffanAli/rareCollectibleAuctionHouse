import { Module } from '@nestjs/common';
import { BidsController } from './bids.controller';
import { BidsService } from './bids.service';
import { Auction, Bid, Notification } from 'src/database/entities';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BidsPagesController } from './bids-pages.controller';
import { BidsUiService } from './bids-ui.service';

@Module({
  imports: [TypeOrmModule.forFeature([Bid, Auction, Notification])],
  controllers: [BidsController, BidsPagesController],
  providers: [BidsService, BidsUiService],
  exports: [BidsService],
})
export class BidsModule {}
