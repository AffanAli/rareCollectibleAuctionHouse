import * as crud from '@nestjsx/crud';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { Controller, UseGuards } from '@nestjs/common';
import { User } from 'src/database/entities/user.entity';
import { JwtAuthGuard } from 'src/modules/utils/guards/jwt-auth.guard';
import { CreateUserDto, UpdateUserDto } from 'src/modules/users/types/user.dto';

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
    ],
  },
})
@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(public readonly service: UsersService) {}

  get base(): crud.CrudController<User> {
    return this;
  }

  @crud.Override('getManyBase')
  getMany(@crud.ParsedRequest() req: crud.CrudRequest) {
    return this.base?.getManyBase?.(req);
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
