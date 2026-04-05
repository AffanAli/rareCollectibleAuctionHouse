import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { DisputeResolution } from '../enums/dispute-resolution.enum';
import { DisputeStatus } from '../enums/dispute-status.enum';
import { Auction } from './auction.entity';
import { User } from './user.entity';

@Entity('disputes')
export class Dispute {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Auction, { onDelete: 'NO ACTION' })
  @JoinColumn({ name: 'auction_id' })
  auction: Auction;

  @ManyToOne(() => User, { onDelete: 'NO ACTION' })
  @JoinColumn({ name: 'raised_by_user_id' })
  raisedBy: User;

  @Column({ type: 'text' })
  description: string;

  @Column({
    name: 'evidence_url',
    type: 'varchar',
    length: 2048,
    nullable: true,
  })
  evidenceUrl: string | null;

  @Column({
    type: 'enum',
    enum: DisputeStatus,
    enumName: 'dispute_status_enum',
    default: DisputeStatus.Open,
  })
  status: DisputeStatus;

  @Column({
    type: 'enum',
    enum: DisputeResolution,
    enumName: 'dispute_resolution_enum',
    nullable: true,
  })
  resolution: DisputeResolution | null;

  @Column({ name: 'resolution_notes', type: 'text', nullable: true })
  resolutionNotes: string | null;

  @ManyToOne(() => User, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'resolved_by_admin_id' })
  resolvedBy: User | null;

  @Column({ name: 'resolved_at', type: 'timestamptz', nullable: true })
  resolvedAt: Date | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamptz', nullable: true })
  deletedAt: Date | null;
}
