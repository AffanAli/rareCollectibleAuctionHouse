import { IsBoolean, IsEnum } from 'class-validator';
import { AuctionStatus } from 'src/database/enums/auction-status.enum';

export class UpdateUserStatusDto {
  @IsBoolean()
  isActive: boolean;
}

export class UpdateAuctionStatusDto {
  @IsEnum(AuctionStatus)
  status: AuctionStatus;
}
