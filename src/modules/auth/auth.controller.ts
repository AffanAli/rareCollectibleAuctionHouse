import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Smoke test for the auth module.
   * @returns { { ok: boolean; scope: string } }
   */
  @Get('test')
  getTest(): { ok: boolean; scope: string } {
    return { ok: true, scope: 'auth' };
  }

  /**
   * Register a new account (stub).
   * @param { RegisterDto } registerDto - Registration body.
   * @returns { { message: string; userId: string } }
   */
  @Post('register')
  register(@Body() registerDto: RegisterDto): { message: string; userId: string } {
    return this.authService.register(registerDto);
  }

  /**
   * Log in (stub).
   * @param { LoginDto } loginDto - Login body.
   * @returns { { message: string; accessToken: string } }
   */
  @Post('login')
  login(@Body() loginDto: LoginDto): { message: string; accessToken: string } {
    return this.authService.login(loginDto);
  }
}
