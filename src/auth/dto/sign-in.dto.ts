import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, IsStrongPassword } from "class-validator";

export class SignInDto {
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({ example: "fulano@gmail.com", description: "email for user" })
  email: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: "s3nh@f0rTe!", description: "password for user" })
  password: string;
}