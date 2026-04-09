import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateMessageDto } from './types/create-message.dto';
import { MessagesService } from './messages.service';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  /**
   * Smoke test for the messages module.
   * @returns { { ok: boolean; scope: string } }
   */
  @Get('test')
  getTest(): { ok: boolean; scope: string } {
    return { ok: true, scope: 'messages' };
  }

  /**
   * List current user's messages / threads (stub).
   * @returns { { items: unknown[] } }
   */
  @Get()
  findMine(): { items: unknown[] } {
    return this.messagesService.findMine();
  }

  /**
   * Send a message (stub).
   * @param { CreateMessageDto } dto - Body.
   * @returns { { message: string; id: string } }
   */
  @Post()
  create(@Body() dto: CreateMessageDto): { message: string; id: string } {
    return this.messagesService.create(dto);
  }
}
