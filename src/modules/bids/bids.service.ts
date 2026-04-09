import { Injectable } from '@nestjs/common';
import { Bid } from 'src/database/entities';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class BidsService extends TypeOrmCrudService<Bid> {
  constructor(@InjectRepository(Bid) public repo: Repository<Bid>) {
    super(repo);
  }
}
