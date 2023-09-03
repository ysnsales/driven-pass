import { IsEmail, IsNotEmpty, IsStrongPassword, MinLength } from "class-validator";

export class SignUpDto {
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsStrongPassword()
    @MinLength(10)
    password: string;
}