import { PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { AuctionStatus } from '../../../database/enums/auction-status.enum';

export class AuctionImageInputDto {
  @IsUrl({ require_protocol: true })
  url: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  sortOrder?: number;
}

export class CreateAuctionDto {
  @IsString()
  @MinLength(3)
  @MaxLength(500)
  title: string;

  @IsString()
  @MinLength(20)
  description: string;

  @IsString()
  @MinLength(2)
  @MaxLength(120)
  category: string;

  @IsString()
  @MinLength(2)
  @MaxLength(120)
  itemCondition: string;

  @IsDateString()
  startsAt: string;

  @IsDateString()
  endsAt: string;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  startingPrice: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  reservePrice?: number;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  provenance?: string;

  @IsString()
  @MinLength(2)
  @MaxLength(160)
  location: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  shippingNotes?: string;

  @IsOptional()
  @IsEnum(AuctionStatus)
  status?: AuctionStatus;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(8)
  @ValidateNested({ each: true })
  @Type(() => AuctionImageInputDto)
  images?: AuctionImageInputDto[];
}

export class UpdateAuctionDto extends PartialType(CreateAuctionDto) {}

export class AuctionListQueryDto {
  @IsOptional()
  @IsString()
  @MaxLength(120)
  q?: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  category?: string;

  @IsOptional()
  @IsEnum(AuctionStatus)
  status?: AuctionStatus;
}
