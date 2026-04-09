import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/database/entities/user.entity';
import { UsersUiService } from './users-ui.service';
import { UsersPagesController } from './users-pages.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController, UsersPagesController],
  providers: [UsersService, UsersUiService],
  exports: [UsersService],
})
export class UsersModule {}
