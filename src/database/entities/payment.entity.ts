import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PaymentStatus } from '../enums/payment-status.enum';
import { numericValueTransformer } from '../transformers/numeric-value.transformer';
import { Auction } from './auction.entity';
import { User } from './user.entity';

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Auction, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'auction_id' })
  auction: Auction | null;

  @ManyToOne(() => User, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'payer_user_id' })
  payer: User;

  @ManyToOne(() => User, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'payee_user_id' })
  payee: User;

  @Column({
    type: 'numeric',
    precision: 12,
    scale: 2,
    transformer: numericValueTransformer,
  })
  amount: number;

  @Column({ type: 'char', length: 3, default: 'GBP' })
  currency: string;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    enumName: 'payment_status_enum',
    default: PaymentStatus.Pending,
  })
  status: PaymentStatus;

  @Column({ name: 'external_reference', type: 'varchar', length: 255, nullable: true })
  externalReference: string | null;

  @Column({ name: 'is_deleted', default: false })
  isDeleted: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
