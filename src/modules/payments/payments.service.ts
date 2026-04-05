import { Injectable } from '@nestjs/common';

@Injectable()
export class PaymentsService {
  /**
   * Stub: all payment records (intended for admin-only in a later iteration).
   * @returns { { items: unknown[] } }
   */
  findAll(): { items: unknown[] } {
    return { items: [] };
  }
}
