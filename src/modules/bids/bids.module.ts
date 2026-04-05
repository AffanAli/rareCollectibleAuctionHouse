import { Module } from '@nestjs/common';
import { AuctionBidsController } from './bids.controller';
import { BidsProbeController } from './bids-probe.controller';
import { BidsService } from './bids.service';
import { MyBidsController } from './my-bids.controller';

@Module({
  controllers: [AuctionBidsController, BidsProbeController, MyBidsController],
  providers: [BidsService],
  exports: [BidsService],
})
export class BidsModule {}
