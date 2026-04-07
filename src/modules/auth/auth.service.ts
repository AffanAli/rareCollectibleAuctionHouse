import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from 'src/modules/users/types/user.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(dto: CreateUserDto) {
    const existing = await this.usersService.repo.findOne({
      where: { email: dto.email },
    });
    if (existing)
      throw new HttpException('Email already exists', HttpStatus.BAD_REQUEST);

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    return this.usersService.repo.save({
      ...dto,
      passwordHash: hashedPassword,
      password: undefined, // remove plain password
    });
  }

  async login(email: string, password: string) {
    const user = await this.usersService.findOne({ where: { email } });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) throw new UnauthorizedException('Invalid credentials');

    const payload = { sub: user.id, email: user.email, role: user.role };
    return { access_token: this.jwtService.sign(payload) };
  }
}
