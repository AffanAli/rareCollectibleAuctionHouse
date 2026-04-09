import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Auction, Message, Notification } from '../../database/entities';
import { CreateMessageDto } from './types/create-message.dto';

type MessageResponse = {
  id: number;
  body: string;
  createdAt: Date;
  auction: {
    id: number;
    title: string;
  };
  sender: {
    id: number;
    displayName: string;
  };
  recipient: {
    id: number;
    displayName: string;
  } | null;
};

type ConversationSummary = {
  auction: {
    id: number;
    title: string;
  };
  counterpart: {
    id: number;
    displayName: string;
  };
  lastMessage: MessageResponse;
};

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private readonly messagesRepo: Repository<Message>,
    @InjectRepository(Auction)
    private readonly auctionsRepo: Repository<Auction>,
    @InjectRepository(Notification)
    private readonly notificationsRepo: Repository<Notification>,
  ) {}

  async sendMessage(
    userId: number,
    auctionId: number,
    dto: CreateMessageDto,
  ): Promise<MessageResponse> {
    const auction = await this.auctionsRepo.findOne({
      where: { id: auctionId },
      relations: { seller: true },
    });

    if (!auction || auction.deletedAt) {
      throw new NotFoundException('Auction not found');
    }

    const isSeller = auction.seller.id === userId;
    const recipientId = dto.recipientId ?? auction.seller.id;

    if (!isSeller && dto.recipientId && dto.recipientId !== auction.seller.id) {
      throw new ForbiddenException('Buyers can only message the seller');
    }

    if (recipientId === userId) {
      throw new BadRequestException('You cannot message yourself');
    }

    if (isSeller && !dto.recipientId) {
      throw new BadRequestException('Seller replies require a recipient');
    }

    if (isSeller) {
      const hasThread = await this.messagesRepo.findOne({
        where: [
          { auction: { id: auctionId }, sender: { id: userId }, recipient: { id: recipientId } },
          { auction: { id: auctionId }, sender: { id: recipientId }, recipient: { id: userId } },
        ],
        relations: { sender: true, recipient: true, auction: true },
      });

      if (!hasThread) {
        throw new ForbiddenException(
          'Seller can only reply to users who already started a conversation',
        );
      }
    }

    const message = await this.messagesRepo.save(
      this.messagesRepo.create({
        body: dto.body.trim(),
        auction: { id: auctionId } as Message['auction'],
        sender: { id: userId } as Message['sender'],
        recipient: { id: recipientId } as Message['recipient'],
      }),
    );

    await this.notificationsRepo.save(
      this.notificationsRepo.create({
        user: { id: recipientId } as Notification['user'],
        type: 'MESSAGE',
        title: `New message about "${auction.title}"`,
        body: dto.body.trim().slice(0, 180),
        payloadJson: {
          auctionId,
          senderId: userId,
        },
        auction: { id: auctionId } as Notification['auction'],
      }),
    );

    const stored = await this.messagesRepo.findOne({
      where: { id: message.id },
      relations: { sender: true, recipient: true, auction: true },
    });

    if (!stored) {
      throw new NotFoundException('Message not found after save');
    }

    return this.toMessageResponse(stored);
  }

  async getConversation(
    userId: number,
    auctionId: number,
    counterpartUserId?: number,
  ): Promise<MessageResponse[]> {
    const auction = await this.auctionsRepo.findOne({
      where: { id: auctionId },
      relations: { seller: true },
    });

    if (!auction || auction.deletedAt) {
      throw new NotFoundException('Auction not found');
    }

    const counterpartId = auction.seller.id === userId ? counterpartUserId : auction.seller.id;

    if (!counterpartId) {
      throw new BadRequestException('A counterpart user is required for this conversation');
    }

    const messages = await this.messagesRepo.find({
      where: [
        {
          auction: { id: auctionId },
          sender: { id: userId },
          recipient: { id: counterpartId },
        },
        {
          auction: { id: auctionId },
          sender: { id: counterpartId },
          recipient: { id: userId },
        },
      ],
      relations: { sender: true, recipient: true, auction: true },
      order: { createdAt: 'ASC' },
    });

    return messages
      .filter((message) => !message.deletedAt)
      .map((message) => this.toMessageResponse(message));
  }

  async getInbox(userId: number): Promise<ConversationSummary[]> {
    const messages = await this.messagesRepo.find({
      where: [{ sender: { id: userId } }, { recipient: { id: userId } }],
      relations: { sender: true, recipient: true, auction: true },
      order: { createdAt: 'DESC' },
    });

    const activeMessages = messages.filter((message) => !message.deletedAt);
    const summaries = new Map<string, ConversationSummary>();

    for (const message of activeMessages) {
      const counterpart =
        message.sender.id === userId ? message.recipient : message.sender;

      if (!counterpart) {
        continue;
      }

      const key = `${message.auction.id}:${counterpart.id}`;
      if (summaries.has(key)) {
        continue;
      }

      summaries.set(key, {
        auction: {
          id: message.auction.id,
          title: message.auction.title,
        },
        counterpart: {
          id: counterpart.id,
          displayName: counterpart.displayName || `User #${counterpart.id}`,
        },
        lastMessage: this.toMessageResponse(message),
      });
    }

    return Array.from(summaries.values());
  }

  private toMessageResponse(message: Message): MessageResponse {
    return {
      id: message.id,
      body: message.body,
      createdAt: message.createdAt,
      auction: {
        id: message.auction.id,
        title: message.auction.title,
      },
      sender: {
        id: message.sender.id,
        displayName: message.sender.displayName || `User #${message.sender.id}`,
      },
      recipient: message.recipient
        ? {
            id: message.recipient.id,
            displayName:
              message.recipient.displayName || `User #${message.recipient.id}`,
          }
        : null,
    };
  }
}
