import { PartialType } from '@nestjs/swagger';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator';
import { DisputeResolution } from 'src/database/enums/dispute-resolution.enum';
import { DisputeStatus } from 'src/database/enums/dispute-status.enum';

export class CreateDisputeDto {
  @IsNumber()
  auctionId: number;

  @IsString()
  @MinLength(10)
  @MaxLength(4000)
  description: string;

  @IsOptional()
  @IsUrl({ require_protocol: true })
  evidenceUrl?: string;
}

export class UpdateDisputeDto extends PartialType(CreateDisputeDto) {}

export class ResolveDisputeDto {
  @IsEnum(DisputeStatus)
  status: DisputeStatus;

  @IsOptional()
  @IsEnum(DisputeResolution)
  resolution?: DisputeResolution;

  @IsOptional()
  @IsString()
  @MaxLength(4000)
  resolutionNotes?: string;
}
