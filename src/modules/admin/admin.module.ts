import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { UsersModule } from 'src/modules/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Auction,
  Bid,
  Message,
  Notification,
  User,
} from 'src/database/entities';
import { DisputesModule } from 'src/modules/disputes/disputes.module';
import { PaymentsModule } from 'src/modules/payments/payments.module';
import { AdminSeedService } from './admin-seed.service';
import { AdminUiService } from './admin-ui.service';
import { AdminPagesController } from './admin-pages.controller';

@Module({
  imports: [
    UsersModule,
    DisputesModule,
    PaymentsModule,
    TypeOrmModule.forFeature([User, Auction, Bid, Message, Notification]),
  ],
  controllers: [AdminController, AdminPagesController],
  providers: [AdminService, AdminSeedService, AdminUiService],
})
export class AdminModule {}
