import { Module } from '@nestjs/common';
import { BidsProbeController } from './bids-probe.controller';
import { BidsService } from './bids.service';
import { Bid } from 'src/database/entities';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Bid])],
  controllers: [BidsProbeController],
  providers: [BidsService],
  exports: [BidsService],
})
export class BidsModule {}
