import { Module } from '@nestjs/common';
import { DisputesController } from './disputes.controller';
import { DisputesService } from './disputes.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Dispute } from 'src/database/entities';

@Module({
  imports: [TypeOrmModule.forFeature([Dispute])],
  controllers: [DisputesController],
  providers: [DisputesService],
  exports: [DisputesService],
})
export class DisputesModule {}
