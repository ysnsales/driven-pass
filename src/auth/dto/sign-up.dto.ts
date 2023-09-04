import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsStrongPassword, MinLength } from "class-validator";

export class SignUpDto {
    @IsNotEmpty()
    @IsEmail()
    @ApiProperty({ example: "fulano@gmail.com", description: "email for user" })
    email: string;

    @IsNotEmpty()
    @IsStrongPassword()
    @MinLength(10)
    @ApiProperty({ example: "s3nh@f0rTe!", description: "password for user" })
    password: string;
}