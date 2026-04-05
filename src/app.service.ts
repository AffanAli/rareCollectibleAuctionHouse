import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  /**
   * Returns a short health string for the root route.
   * @returns { string }
   */
  getHealth(): string {
    return 'Rare Collectible Auction House API';
  }
}
