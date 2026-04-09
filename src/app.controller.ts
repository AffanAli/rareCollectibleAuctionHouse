import { Controller, Get, Header } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Header('Content-Type', 'text/html; charset=utf-8')
  getLandingPage(): string {
    return this.appService.getLandingPage();
  }

  @Get('login')
  @Header('Content-Type', 'text/html; charset=utf-8')
  getLoginPage(): string {
    return this.appService.getLoginPage();
  }

  @Get('register')
  @Header('Content-Type', 'text/html; charset=utf-8')
  getRegisterPage(): string {
    return this.appService.getRegisterPage();
  }

  /**
   * Returns a simple health message for connectivity checks.
   * @returns { string }
   */
  @Get('health')
  getHealth(): string {
    return this.appService.getHealth();
  }

  /**
   * Smoke test endpoint for API availability.
   * @returns { { ok: boolean; scope: string } }
   */
  @Get('test')
  getTest(): { ok: boolean; scope: string } {
    return { ok: true, scope: 'app' };
  }
}
