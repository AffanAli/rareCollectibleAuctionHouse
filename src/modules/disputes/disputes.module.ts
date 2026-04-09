import { Module } from '@nestjs/common';
import { DisputesController } from './disputes.controller';
import { DisputesService } from './disputes.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Auction, Dispute, Notification } from 'src/database/entities';
import { DisputesPagesController } from './disputes-pages.controller';
import { DisputesUiService } from './disputes-ui.service';

@Module({
  imports: [TypeOrmModule.forFeature([Dispute, Auction, Notification])],
  controllers: [DisputesController, DisputesPagesController],
  providers: [DisputesService, DisputesUiService],
  exports: [DisputesService],
})
export class DisputesModule {}
