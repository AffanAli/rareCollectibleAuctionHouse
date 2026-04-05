import { IsOptional, IsString, MinLength } from 'class-validator';

export class CreateDisputeDto {
  @IsString()
  @MinLength(1)
  auctionId: string;

  @IsString()
  @MinLength(10)
  description: string;

  @IsOptional()
  @IsString()
  evidenceUrl?: string;
}
