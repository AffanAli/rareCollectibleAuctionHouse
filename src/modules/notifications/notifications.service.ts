import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Notification } from '../../database/entities';
import { Repository } from 'typeorm';
import { AuctionsService } from '../auctions/auctions.service';

type NotificationResponse = {
  id: number;
  type: string;
  title: string;
  body: string | null;
  payloadJson: Record<string, unknown> | null;
  readAt: Date | null;
  createdAt: Date;
  auction: {
    id: number;
    title?: string;
  } | null;
};

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    public readonly repo: Repository<Notification>,
    private readonly auctionsService: AuctionsService,
  ) {}

  async getMine(userId: number): Promise<NotificationResponse[]> {
    await this.auctionsService.settleExpiredAuctions();
    const notifications = await this.repo.find({
      where: { user: { id: userId } },
      relations: { auction: true },
      order: { createdAt: 'DESC' },
      take: 50,
    });

    return notifications
      .filter((notification) => !notification.deletedAt)
      .map((notification) => this.toResponse(notification));
  }

  async getSummary(userId: number): Promise<{
    unreadCount: number;
    recent: NotificationResponse[];
  }> {
    await this.auctionsService.settleExpiredAuctions();
    const notifications = await this.getMine(userId);
    return {
      unreadCount: notifications.filter((notification) => !notification.readAt).length,
      recent: notifications.slice(0, 8),
    };
  }

  async markAsRead(userId: number, notificationId: number): Promise<NotificationResponse> {
    const notification = await this.repo.findOne({
      where: { id: notificationId, user: { id: userId } },
      relations: { auction: true },
    });

    if (!notification || notification.deletedAt) {
      throw new NotFoundException('Notification not found');
    }

    if (!notification.readAt) {
      notification.readAt = new Date();
      await this.repo.save(notification);
    }

    return this.toResponse(notification);
  }

  async markAllAsRead(userId: number): Promise<{ updated: true }> {
    const notifications = await this.repo.find({
      where: { user: { id: userId } },
    });

    const unread = notifications.filter(
      (notification) => !notification.deletedAt && !notification.readAt,
    );

    if (unread.length > 0) {
      unread.forEach((notification) => {
        notification.readAt = new Date();
      });
      await this.repo.save(unread);
    }

    return { updated: true };
  }

  private toResponse(notification: Notification): NotificationResponse {
    return {
      id: notification.id,
      type: notification.type,
      title: notification.title,
      body: notification.body,
      payloadJson: notification.payloadJson,
      readAt: notification.readAt,
      createdAt: notification.createdAt,
      auction: notification.auction
        ? {
            id: notification.auction.id,
            title: 'title' in notification.auction ? notification.auction.title : undefined,
          }
        : null,
    };
  }
}
