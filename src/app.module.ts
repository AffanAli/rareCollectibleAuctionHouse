import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AdminModule } from './modules/admin/admin.module';
import { AuctionsModule } from './modules/auctions/auctions.module';
import { AuthModule } from './modules/auth/auth.module';
import { BidsModule } from './modules/bids/bids.module';
import { DisputesModule } from './modules/disputes/disputes.module';
import { MessagesModule } from './modules/messages/messages.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    AuctionsModule,
    BidsModule,
    MessagesModule,
    NotificationsModule,
    DisputesModule,
    PaymentsModule,
    AdminModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
