import { Injectable } from '@nestjs/common';
import { CreateDisputeDto } from './dto/create-dispute.dto';

@Injectable()
export class DisputesService {
  /**
   * Stub: disputes raised by or visible to the user.
   * @returns { { items: unknown[] } }
   */
  findMine(): { items: unknown[] } {
    return { items: [] };
  }

  /**
   * Stub: open a new dispute.
   * @param { CreateDisputeDto } dto - Dispute payload.
   * @returns { { message: string; id: string } }
   */
  create(dto: CreateDisputeDto): { message: string; id: string } {
    return { message: 'TODO: persist dispute and notify admins', id: 'stub-dispute-id' };
  }
}
