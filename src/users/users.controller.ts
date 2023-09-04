import { Body, Controller, Delete, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';
import { User } from '../decorators/user.decorator';
import { UsersService } from './users.service';
import { DeleteUserDto } from './dto/delete-usesr.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}


  @UseGuards(AuthGuard)
  @Get("/me")
  @ApiOperation({ summary: "Get logged user information" })
  getUserInformation(@User() user) {
    return user;
  }

  @UseGuards(AuthGuard)
  @Delete("/erase")
  @ApiOperation({ summary: "Delete logged user" })
  deleteUser(@User() user, @Body() data: DeleteUserDto){
    const userId = user.id;
    return this.usersService.deleteUser(userId, data.password);    
  }

}