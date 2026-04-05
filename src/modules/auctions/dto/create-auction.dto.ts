import { IsDateString, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateAuctionDto {
  @IsString()
  @MinLength(3)
  title: string;

  @IsString()
  @MinLength(10)
  description: string;

  @IsOptional()
  @IsDateString()
  endsAt?: string;
}
