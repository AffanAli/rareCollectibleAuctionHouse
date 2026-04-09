import { PartialType } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { Auction, User } from 'src/database/entities';
import { DisputeResolution } from 'src/database/enums/dispute-resolution.enum';
import { DisputeStatus } from 'src/database/enums/dispute-status.enum';

export class CreateDisputeDto {
  @IsObject()
  auction: Partial<Auction>;

  @IsObject()
  raisedBy: Partial<User>;

  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  evidenceUrl?: string;
}

export class UpdateDisputeDto extends PartialType(CreateDisputeDto) {
  @IsOptional()
  @IsEnum(DisputeStatus)
  status?: DisputeStatus;

  @IsOptional()
  @IsEnum(DisputeResolution)
  resolution: DisputeResolution;

  @IsOptional()
  @IsString()
  resolutionNotes?: string;

  @IsOptional()
  @IsObject()
  resolvedBy?: User;

  @IsOptional()
  @IsDateString()
  resolvedAt?: Date;
}
