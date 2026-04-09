import { Injectable } from '@nestjs/common';
import { Auction } from 'src/database/entities';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AuctionsService extends TypeOrmCrudService<Auction> {
  constructor(@InjectRepository(Auction) public repo: Repository<Auction>) {
    super(repo);
  }

  // getOne(req: CrudRequest) {
  //   return this.repo.findOne({
  //     where: { id: req.parsed.paramsFilter[0].value },
  //     relations: ['seller', 'images', 'bids'],
  //   });
  // }
}
