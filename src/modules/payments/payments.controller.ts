import { Controller, Get } from '@nestjs/common';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  /**
   * Smoke test for the payments module.
   * @returns { { ok: boolean; scope: string } }
   */
  @Get('test')
  getTest(): { ok: boolean; scope: string } {
    return { ok: true, scope: 'payments' };
  }

  /**
   * Payment list stub (add admin guard later).
   * @returns { { items: unknown[] } }
   */
  @Get()
  findAll(): { items: unknown[] } {
    return this.paymentsService.findAll();
  }
}
