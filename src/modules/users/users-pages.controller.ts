import { Controller, Get, Header } from '@nestjs/common';
import { UsersUiService } from './users-ui.service';

@Controller()
export class UsersPagesController {
  constructor(private readonly usersUiService: UsersUiService) {}

  @Get('profile')
  @Header('Content-Type', 'text/html; charset=utf-8')
  getProfilePage(): string {
    return this.usersUiService.getProfilePage();
  }
}
