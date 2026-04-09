import { Controller, Get, Header } from '@nestjs/common';
import { MessagesUiService } from './messages-ui.service';

@Controller()
export class MessagesPagesController {
  constructor(private readonly messagesUiService: MessagesUiService) {}

  @Get('messages')
  @Header('Content-Type', 'text/html; charset=utf-8')
  getMessagesPage(): string {
    return this.messagesUiService.getMessagesPage();
  }
}
