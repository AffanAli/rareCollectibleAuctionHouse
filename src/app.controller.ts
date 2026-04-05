import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  /**
   * Returns a simple health message for connectivity checks.
   * @returns { string }
   */
  @Get()
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
