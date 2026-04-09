import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { UserRole } from 'src/database/enums/user-role.enum';
import { Roles } from 'src/modules/utils/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/modules/utils/guards/jwt-auth.guard';
import { RolesGuard } from 'src/modules/utils/guards/roles.guard';
import { JwtGuardResponse } from 'src/modules/utils/guards/types/jwt-auth.interface';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './types/create-message.dto';

type AuthenticatedRequest = Request & { user: JwtGuardResponse };

@ApiTags('Messages')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.Admin, UserRole.User)
@Controller()
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get('messages/inbox')
  getInbox(@Req() req: AuthenticatedRequest) {
    return this.messagesService.getInbox(req.user.id);
  }

  @Get('auctions/:auctionId/messages')
  getConversation(
    @Req() req: AuthenticatedRequest,
    @Param('auctionId', ParseIntPipe) auctionId: number,
    @Query('counterpartUserId') counterpartUserId?: string,
  ) {
    return this.messagesService.getConversation(
      req.user.id,
      auctionId,
      counterpartUserId ? Number(counterpartUserId) : undefined,
    );
  }

  @Post('auctions/:auctionId/messages')
  sendMessage(
    @Req() req: AuthenticatedRequest,
    @Param('auctionId', ParseIntPipe) auctionId: number,
    @Body() dto: CreateMessageDto,
  ) {
    return this.messagesService.sendMessage(req.user.id, auctionId, dto);
  }
}
