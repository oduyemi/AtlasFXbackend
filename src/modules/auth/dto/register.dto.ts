import { IsEmail, IsString, MinLength } from "class-validator";


export class RegisterDto {
    fname: string;
    lname: string;

    @IsEmail()
    email: string;

    @MinLength(8)
    password: string

    confirmPassword: string
}