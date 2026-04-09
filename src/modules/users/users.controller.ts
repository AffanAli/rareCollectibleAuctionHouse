import * as crud from '@nestjsx/crud';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { User } from 'src/database/entities/user.entity';
import { JwtAuthGuard } from 'src/modules/utils/guards/jwt-auth.guard';
import {
  CreateUserDto,
  UpdateProfileDto,
  UpdateUserDto,
} from 'src/modules/users/types/user.dto';
import { UserRole } from 'src/database/enums/user-role.enum';
import { Roles } from 'src/modules/utils/decorators/roles.decorator';
import { RolesGuard } from 'src/modules/utils/guards/roles.guard';
import { JwtGuardResponse } from 'src/modules/utils/guards/types/jwt-auth.interface';
import { Request } from 'express';

type AuthenticatedRequest = Request & { user: JwtGuardResponse };

@crud.Crud({
  model: { type: User },
  dto: {
    create: CreateUserDto,
    update: UpdateUserDto,
  },
  routes: {
    exclude: [
      'createOneBase',
      'replaceOneBase',
      'deleteOneBase',
      'createManyBase',
      'getManyBase',
    ],
  },
})
@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.User, UserRole.Admin)
@Controller('users')
export class UsersController {
  constructor(public readonly service: UsersService) {}

  @Get('me')
  getProfile(@Req() req: AuthenticatedRequest) {
    return this.service.getProfile(req.user.id);
  }

  @Patch('me')
  updateProfile(
    @Req() req: AuthenticatedRequest,
    @Body() dto: UpdateProfileDto,
  ) {
    return this.service.updateProfile(req.user.id, dto);
  }

  get base(): crud.CrudController<User> {
    return this;
  }

  @crud.Override('getOneBase')
  getOne(@crud.ParsedRequest() req: crud.CrudRequest) {
    return this.base?.getOneBase?.(req);
  }

  @crud.Override('createOneBase')
  async createOne(
    @crud.ParsedRequest() req: crud.CrudRequest,
    @crud.ParsedBody() dto: CreateUserDto,
  ) {
    const hashedPassword = dto.password;

    return this.base?.createOneBase?.(req, {
      ...dto,
      passwordHash: hashedPassword,
    } as unknown as User);
  }

  @crud.Override('updateOneBase')
  updateOne(
    @crud.ParsedRequest() req: crud.CrudRequest,
    @crud.ParsedBody() dto: UpdateUserDto,
  ) {
    return this.base?.updateOneBase?.(req, dto as unknown as User);
  }
}
