import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './types/create-message.dto';

@Injectable()
export class MessagesService {
  /**
   * Stub: threads visible to the current user.
   * @returns { { items: unknown[] } }
   */
  findMine(): { items: unknown[] } {
    return { items: [] };
  }

  /**
   * Stub: send a message tied to an auction.
   * @param { CreateMessageDto } dto - Message payload.
   * @returns { { message: string; id: string } }
   */
  create(dto: CreateMessageDto): { message: string; id: string } {
    return { message: 'TODO: persist message', id: 'stub-message-id' };
  }
}
