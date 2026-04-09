import { Module } from '@nestjs/common';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Auction, Message, Notification } from 'src/database/entities';
import { MessagesPagesController } from './messages-pages.controller';
import { MessagesUiService } from './messages-ui.service';

@Module({
  imports: [TypeOrmModule.forFeature([Message, Auction, Notification])],
  controllers: [MessagesController, MessagesPagesController],
  providers: [MessagesService, MessagesUiService],
  exports: [MessagesService],
})
export class MessagesModule {}
