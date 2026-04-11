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
      const updates: Partial<typeof existingAdmin> = {};

      if (existingAdmin.role !== UserRole.Admin) {
        updates.role = UserRole.Admin;
      }

      if (!existingAdmin.isActive) {
        updates.isActive = true;
      }

      if (displayName && existingAdmin.displayName !== displayName) {
        updates.displayName = displayName;
      }

      const passwordMatches = await bcrypt.compare(
        password,
        existingAdmin.passwordHash,
      );

      if (!passwordMatches) {
        updates.passwordHash = await bcrypt.hash(password, 10);
      }

      if (Object.keys(updates).length > 0) {
        await this.usersService.repo.save({
          ...existingAdmin,
          ...updates,
        });
      }

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
