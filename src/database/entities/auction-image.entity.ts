import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Auction } from './auction.entity';

@Entity('auction_images')
export class AuctionImage {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Auction, (auction) => auction.images, {
    onDelete: 'NO ACTION',
  })
  @JoinColumn({ name: 'auction_id' })
  auction: Auction;

  @Column({ type: 'varchar', length: 2048 })
  url: string;

  @Column({ name: 'sort_order', type: 'int', default: 0 })
  sortOrder: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamptz', nullable: true })
  deletedAt: Date | null;
}
