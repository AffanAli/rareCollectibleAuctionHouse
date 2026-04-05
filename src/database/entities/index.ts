import { AuctionImage } from './auction-image.entity';
import { Auction } from './auction.entity';
import { Bid } from './bid.entity';
import { Dispute } from './dispute.entity';
import { Message } from './message.entity';
import { Notification } from './notification.entity';
import { Payment } from './payment.entity';
import { User } from './user.entity';

export const typeOrmEntities = [
  User,
  Auction,
  AuctionImage,
  Bid,
  Message,
  Notification,
  Dispute,
  Payment,
];

export {
  Auction,
  AuctionImage,
  Bid,
  Dispute,
  Message,
  Notification,
  Payment,
  User,
};
