import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Notification } from 'src/database/entities';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';

@Injectable()
export class NotificationsService extends TypeOrmCrudService<Notification> {
  constructor(
    @InjectRepository(Notification) public repo: Repository<Notification>,
  ) {
    super(repo);
  }
}
