import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Dispute } from 'src/database/entities';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';

@Injectable()
export class DisputesService extends TypeOrmCrudService<Dispute> {
  constructor(@InjectRepository(Dispute) public repo: Repository<Dispute>) {
    super(repo);
  }
}
