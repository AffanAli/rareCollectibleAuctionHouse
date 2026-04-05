import { Controller, Get } from '@nestjs/common';

/**
 * Separate controller so module smoke test does not sit under :auctionId.
 */
@Controller('bids')
export class BidsProbeController {
  /**
   * Smoke test for the bids module.
   * @returns { { ok: boolean; scope: string } }
   */
  @Get('test')
  getTest(): { ok: boolean; scope: string } {
    return { ok: true, scope: 'bids' };
  }
}
