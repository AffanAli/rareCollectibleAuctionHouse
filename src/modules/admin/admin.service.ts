import { Injectable } from '@nestjs/common';
import { User } from 'src/database/entities';
import { UserRole } from 'src/database/enums/user-role.enum';
import { UsersService } from 'src/modules/users/users.service';

@Injectable()
export class AdminService {
  constructor(private usersService: UsersService) {}

  listUsers(): Promise<User[]> {
    return this.usersService.repo.findBy({
      role: UserRole.User,
    });
  }
}
