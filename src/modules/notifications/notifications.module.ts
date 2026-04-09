import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from 'src/database/entities';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { NotificationsPagesController } from './notifications-pages.controller';
import { NotificationsUiService } from './notifications-ui.service';
import { AuctionsModule } from '../auctions/auctions.module';

@Module({
  imports: [TypeOrmModule.forFeature([Notification]), AuctionsModule],
  controllers: [NotificationsController, NotificationsPagesController],
  providers: [NotificationsService, NotificationsUiService],
  exports: [NotificationsService],
})
export class NotificationsModule {}
