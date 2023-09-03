import { IsEmail, IsStrongPassword, MinLength } from "class-validator";

export class SignUpDto {
    @IsEmail()
    email: string;

    @IsStrongPassword()
    @MinLength(10)
    password: string;
}