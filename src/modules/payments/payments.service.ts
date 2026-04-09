import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Payment } from 'src/database/entities';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';

@Injectable()
export class PaymentsService extends TypeOrmCrudService<Payment> {
  constructor(@InjectRepository(Payment) public repo: Repository<Payment>) {
    super(repo);
  }
}
