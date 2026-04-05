import { Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  /**
   * Stub: register a new user (persist credentials in a later iteration).
   * @param { RegisterDto } registerDto - Email and password payload.
   * @returns { { message: string; userId: string } }
   */
  register(registerDto: RegisterDto): { message: string; userId: string } {
    return {
      message: 'TODO: persist user and hash password',
      userId: `stub-${registerDto.email}`,
    };
  }

  /**
   * Stub: validate credentials and issue a session or token.
   * @param { LoginDto } loginDto - Login payload.
   * @returns { { message: string; accessToken: string } }
   */
  login(loginDto: LoginDto): { message: string; accessToken: string } {
    return {
      message: 'TODO: verify password and issue JWT',
      accessToken: 'stub-token',
    };
  }
}
