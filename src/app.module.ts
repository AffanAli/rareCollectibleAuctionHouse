import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { buildTypeOrmRootOptions } from './database/typeorm-root-options';
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
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: buildTypeOrmRootOptions,
      inject: [ConfigService],
    }),
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
