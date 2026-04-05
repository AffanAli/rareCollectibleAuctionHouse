import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateDisputeDto } from './dto/create-dispute.dto';
import { DisputesService } from './disputes.service';

@Controller('disputes')
export class DisputesController {
  constructor(private readonly disputesService: DisputesService) {}

  /**
   * Smoke test for the disputes module.
   * @returns { { ok: boolean; scope: string } }
   */
  @Get('test')
  getTest(): { ok: boolean; scope: string } {
    return { ok: true, scope: 'disputes' };
  }

  /**
   * List disputes for the current user (stub).
   * @returns { { items: unknown[] } }
   */
  @Get()
  findMine(): { items: unknown[] } {
    return this.disputesService.findMine();
  }

  /**
   * Raise a dispute (stub).
   * @param { CreateDisputeDto } dto - Body.
   * @returns { { message: string; id: string } }
   */
  @Post()
  create(@Body() dto: CreateDisputeDto): { message: string; id: string } {
    return this.disputesService.create(dto);
  }
}
