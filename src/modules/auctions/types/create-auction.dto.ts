import { PartialType } from '@nestjs/swagger';
import {
  IsDateString,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateAuctionDto {
  @IsObject()
  seller: Record<string, number>;

  @IsString()
  @MinLength(3)
  title: string;

  @IsString()
  @MinLength(10)
  description: string;

  @IsDateString()
  startsAt?: string;

  @IsDateString()
  endsAt?: string;

  @IsNumber()
  startingPrice: number;
}

export class UpdateAuctionDto extends PartialType(CreateAuctionDto) {
  @IsOptional()
  @IsNumber()
  currentHighBidId: number;

  @IsOptional()
  @IsNumber()
  winningBidId: number;
}
