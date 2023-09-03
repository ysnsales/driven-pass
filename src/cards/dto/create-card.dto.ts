import { IsNotEmpty, IsNumberString, IsString, Length, MaxLength, MinLength } from "class-validator";

export class CreateCardDto {
    @IsNotEmpty()
    @IsString()
    title: string;
    
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsNumberString()
    @MinLength(13)
    @MaxLength(16)
    number: string;

    @IsNotEmpty()
    @IsString()
    expirationDate: string;
  
    @IsNotEmpty()
    @IsNumberString()
    @Length(3)
    cvv: string;
  
    @IsNotEmpty()
    @IsString()
    password: string;
  
    @IsNotEmpty()
    type: string;
  }