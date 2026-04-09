import { IsOptional, IsString, MinLength } from 'class-validator';

export class CreateMessageDto {
  @IsString()
  @MinLength(1)
  auctionId: string;

  @IsString()
  @MinLength(1)
  body: string;

  @IsOptional()
  @IsString()
  recipientUserId?: string;
}
