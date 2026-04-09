import { Module } from '@nestjs/common';
import { AuctionsController } from './auctions.controller';
import { AuctionsService } from './auctions.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Auction, AuctionImage } from 'src/database/entities';
import { AuctionsUiService } from './auctions-ui.service';
import { AuctionsPagesController } from './auctions-pages.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Auction, AuctionImage])],
  controllers: [AuctionsController, AuctionsPagesController],
  providers: [AuctionsService, AuctionsUiService],
  exports: [AuctionsService],
})
export class AuctionsModule {}
