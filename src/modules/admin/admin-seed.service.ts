import * as bcrypt from 'bcrypt';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { UserRole } from 'src/database/enums/user-role.enum';
import { UsersService } from 'src/modules/users/users.service';

@Injectable()
export class AdminSeedService implements OnModuleInit {
  constructor(private readonly usersService: UsersService) {}

  async onModuleInit(): Promise<void> {
    const email =
      process.env.ADMIN_EMAIL?.trim() || 'admin@rare-collectibles.local';
    const password =
      process.env.ADMIN_PASSWORD?.trim() || 'RareCollectiblesAdmin#2026!';
    const displayName =
      process.env.ADMIN_DISPLAY_NAME?.trim() || 'Platform Administrator';

    const existingAdmin = await this.usersService.repo.findOne({
      where: { email },
    });

    if (existingAdmin) {
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);
    await this.usersService.repo.save({
      email,
      passwordHash,
      role: UserRole.Admin,
      displayName,
      contactPhone: null,
      preferencesJson: {
        seededAdmin: true,
      },
      isActive: true,
    });
  }
}
