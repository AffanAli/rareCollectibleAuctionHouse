import { IsNumber, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateMessageDto {
  @IsOptional()
  @IsNumber()
  recipientId?: number;

  @IsString()
  @MinLength(1)
  @MaxLength(4000)
  body: string;
}
