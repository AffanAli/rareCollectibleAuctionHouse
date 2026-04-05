import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AuctionStatus } from '../enums/auction-status.enum';
import { numericValueTransformer } from '../transformers/numeric-value.transformer';
import { AuctionImage } from './auction-image.entity';
import { Bid } from './bid.entity';
import { User } from './user.entity';

@Entity('auctions')
export class Auction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { onDelete: 'NO ACTION' })
  @JoinColumn({ name: 'seller_id' })
  seller: User;

  @Column({ type: 'varchar', length: 500 })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({
    type: 'enum',
    enum: AuctionStatus,
    enumName: 'auction_status_enum',
    default: AuctionStatus.Draft,
  })
  status: AuctionStatus;

  @Column({ name: 'starts_at', type: 'timestamptz' })
  startsAt: Date;

  @Column({ name: 'ends_at', type: 'timestamptz' })
  endsAt: Date;

  @Column({
    name: 'starting_price',
    type: 'numeric',
    precision: 12,
    scale: 2,
    transformer: numericValueTransformer,
  })
  startingPrice: number;

  @ManyToOne(() => Bid, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'current_high_bid_id' })
  currentHighBid: Bid | null;

  @ManyToOne(() => Bid, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'winning_bid_id' })
  winningBid: Bid | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamptz', nullable: true })
  deletedAt: Date | null;

  @OneToMany(() => AuctionImage, (image) => image.auction)
  images: AuctionImage[];

  @OneToMany(() => Bid, (bid) => bid.auction)
  bids: Bid[];
}
