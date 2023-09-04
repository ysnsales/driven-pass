import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('users')
export class AuthController {

  constructor(private readonly authService: AuthService) { }

  // create
  @Post('sign-up')
  @ApiOperation({ summary: "Create a new user" })
  @ApiResponse({ status: HttpStatus.OK, description: "Everything is okay." })
  @ApiResponse({status: HttpStatus.CONFLICT, description: 'User already exists'})
  @HttpCode(HttpStatus.CREATED)
  signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  // login
  @Post("sign-in")
  @ApiOperation({ summary: "Authenticate user" })
  @ApiResponse({ status: HttpStatus.OK, description: "Everything is okay." })
  @HttpCode(HttpStatus.OK)
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }

}
