import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Message } from 'src/database/entities';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';

@Injectable()
export class MessagesService extends TypeOrmCrudService<Message> {
  constructor(@InjectRepository(Message) public repo: Repository<Message>) {
    super(repo);
  }
}
