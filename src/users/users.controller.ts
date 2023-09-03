import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';
import { User } from '../decorators/user.decorator';

@Controller('users')
export class UsersController {

  @UseGuards(AuthGuard)
  @Get("/me")
  getUserInformation(@User() user) {
    return user;
  }

}