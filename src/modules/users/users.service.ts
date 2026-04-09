import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CrudRequest } from '@nestjsx/crud';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { User } from 'src/database/entities/user.entity';
import { Repository } from 'typeorm';
import { UpdateProfileDto } from './types/user.dto';

type ProfileResponse = {
  id: number;
  email: string;
  role: User['role'];
  displayName: string | null;
  contactPhone: string | null;
  preferencesJson: Record<string, unknown> | null;
  createdAt: Date;
  updatedAt: Date;
};

@Injectable()
export class UsersService extends TypeOrmCrudService<User> {
  constructor(@InjectRepository(User) public repo: Repository<User>) {
    super(repo);
  }

  createOne(req: CrudRequest, dto: User) {
    return super.createOne(req, dto);
  }

  async getProfile(userId: number): Promise<ProfileResponse> {
    const user = await this.repo.findOne({ where: { id: userId } });

    if (!user || user.deletedAt) {
      throw new NotFoundException('User not found');
    }

    return this.toProfileResponse(user);
  }

  async updateProfile(
    userId: number,
    dto: UpdateProfileDto,
  ): Promise<ProfileResponse> {
    const user = await this.repo.findOne({ where: { id: userId } });

    if (!user || user.deletedAt) {
      throw new NotFoundException('User not found');
    }

    if (dto.displayName !== undefined) {
      user.displayName = dto.displayName.trim() || null;
    }

    if (dto.contactPhone !== undefined) {
      user.contactPhone = dto.contactPhone.trim() || null;
    }

    if (dto.preferencesJson !== undefined) {
      user.preferencesJson = dto.preferencesJson;
    }

    await this.repo.save(user);
    return this.toProfileResponse(user);
  }

  private toProfileResponse(user: User): ProfileResponse {
    return {
      id: user.id,
      email: user.email,
      role: user.role,
      displayName: user.displayName,
      contactPhone: user.contactPhone,
      preferencesJson: user.preferencesJson,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
