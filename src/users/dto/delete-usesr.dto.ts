import { IsEmail, IsNotEmpty, IsString, IsStrongPassword } from "class-validator";

export class DeleteUserDto {
  @IsNotEmpty()
  @IsString()
  password: string;
}