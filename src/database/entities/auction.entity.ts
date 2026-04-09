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
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { onDelete: 'NO ACTION' })
  @JoinColumn({ name: 'seller_id' })
  seller: User;

  @Column({ type: 'varchar', length: 500 })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'varchar', length: 120 })
  category: string;

  @Column({ name: 'item_condition', type: 'varchar', length: 120 })
  itemCondition: string;

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

  @Column({
    name: 'reserve_price',
    type: 'numeric',
    precision: 12,
    scale: 2,
    nullable: true,
    transformer: numericValueTransformer,
  })
  reservePrice: number | null;

  @Column({ type: 'text', nullable: true })
  provenance: string | null;

  @Column({ type: 'varchar', length: 160 })
  location: string;

  @Column({ name: 'shipping_notes', type: 'text', nullable: true })
  shippingNotes: string | null;

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
