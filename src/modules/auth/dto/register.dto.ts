import { IsEmail, IsString, MinLength } from "class-validator";


export class RegisterDto {
    @IsString()
    fname: string
    
    @IsString()
    lname: string

    @IsEmail()
    email: string;

    @MinLength(8)
    password: string

    confirmPassword: string
}