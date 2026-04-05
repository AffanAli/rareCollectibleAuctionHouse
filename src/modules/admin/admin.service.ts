import { Injectable } from '@nestjs/common';

@Injectable()
export class AdminService {
  /**
   * Stub dataset for admin dashboards.
   * @param { string } resource - Resource name.
   * @returns { { items: unknown[]; resource: string } }
   */
  listResource(resource: string): { items: unknown[]; resource: string } {
    return { items: [], resource };
  }
}
