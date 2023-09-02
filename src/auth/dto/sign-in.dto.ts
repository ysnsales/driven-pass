import { IsEmail, IsString, IsStrongPassword } from "class-validator";

export class SignInDto {
  @IsEmail()
  email: string;
  
  @IsStrongPassword()
  password: string;
}