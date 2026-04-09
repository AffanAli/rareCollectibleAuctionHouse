import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Payment } from '../../database/entities';
import { Repository } from 'typeorm';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    public readonly repo: Repository<Payment>,
  ) {}

  async getAdminPayments() {
    return this.repo.find({
      relations: {
        auction: true,
        payer: true,
        payee: true,
      },
      order: { createdAt: 'DESC' },
    });
  }
}
