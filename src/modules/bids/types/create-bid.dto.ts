import { IsNumber, Min } from 'class-validator';

export class CreateBidDto {
  @IsNumber()
  auctionId: number;

  @IsNumber()
  bidderId: number;

  @IsNumber()
  @Min(0.01)
  amount: number;
}
