import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Auction,
  Bid,
  Message,
  Notification,
  Payment,
  User,
} from 'src/database/entities';
import { AuctionStatus } from 'src/database/enums/auction-status.enum';
import { DisputesService } from 'src/modules/disputes/disputes.service';
import { PaymentsService } from 'src/modules/payments/payments.service';
import { Repository } from 'typeorm';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
    @InjectRepository(Auction)
    private readonly auctionsRepo: Repository<Auction>,
    @InjectRepository(Bid)
    private readonly bidsRepo: Repository<Bid>,
    @InjectRepository(Message)
    private readonly messagesRepo: Repository<Message>,
    @InjectRepository(Notification)
    private readonly notificationsRepo: Repository<Notification>,
    private readonly disputesService: DisputesService,
    private readonly paymentsService: PaymentsService,
  ) {}

  async getDashboard() {
    const [users, auctions, bids, messages, notifications, disputes, payments] =
      await Promise.all([
        this.usersRepo.find(),
        this.auctionsRepo.find({
          relations: {
            seller: true,
            currentHighBid: { bidder: true },
            winningBid: { bidder: true },
          },
          order: { updatedAt: 'DESC' },
        }),
        this.bidsRepo.find({
          relations: { bidder: true, auction: true },
          order: { createdAt: 'DESC' },
        }),
        this.messagesRepo.find({
          relations: { sender: true, recipient: true, auction: true },
          order: { createdAt: 'DESC' },
        }),
        this.notificationsRepo.find({
          relations: { user: true, auction: true },
          order: { createdAt: 'DESC' },
        }),
        this.disputesService.getAllDisputes(),
        this.paymentsService.getAdminPayments(),
      ]);

    return {
      summary: {
        users: users.filter((user) => !user.deletedAt).length,
        auctions: auctions.filter((auction) => !auction.deletedAt).length,
        bids: bids.filter((bid) => !bid.deletedAt).length,
        messages: messages.filter((message) => !message.deletedAt).length,
        notifications: notifications.filter((notification) => !notification.deletedAt).length,
        disputes: disputes.filter((dispute) => !dispute.deletedAt).length,
        payments: payments.filter((payment) => !payment.deletedAt).length,
      },
      users,
      auctions,
      bids,
      messages,
      notifications,
      disputes,
      payments,
    };
  }

  listUsers() {
    return this.usersRepo.find({ order: { createdAt: 'DESC' } });
  }

  listAuctions() {
    return this.auctionsRepo.find({
      relations: { seller: true, winningBid: { bidder: true } },
      order: { updatedAt: 'DESC' },
    });
  }

  listBids() {
    return this.bidsRepo.find({
      relations: { bidder: true, auction: true },
      order: { createdAt: 'DESC' },
    });
  }

  listMessages() {
    return this.messagesRepo.find({
      relations: { sender: true, recipient: true, auction: true },
      order: { createdAt: 'DESC' },
    });
  }

  listNotifications() {
    return this.notificationsRepo.find({
      relations: { user: true, auction: true },
      order: { createdAt: 'DESC' },
    });
  }

  async updateUserStatus(userId: number, isActive: boolean) {
    const user = await this.usersRepo.findOne({ where: { id: userId } });

    if (!user || user.deletedAt) {
      throw new NotFoundException('User not found');
    }

    user.isActive = isActive;
    await this.usersRepo.save(user);
    return user;
  }

  async updateAuctionStatus(auctionId: number, status: AuctionStatus) {
    const auction = await this.auctionsRepo.findOne({
      where: { id: auctionId },
      relations: { seller: true, winningBid: { bidder: true } },
    });

    if (!auction || auction.deletedAt) {
      throw new NotFoundException('Auction not found');
    }

    auction.status = status;
    await this.auctionsRepo.save(auction);

    return this.auctionsRepo.findOne({
      where: { id: auctionId },
      relations: { seller: true, winningBid: { bidder: true } },
    });
  }
}
