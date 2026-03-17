import { IsEmail, IsString, MinLength } from "class-validator";

export class RegisterDto {
    @IsString()
    fname: string;
    
    @IsString()
    lname: string;
    
    @IsEmail()
    email: string;
    
    @IsString()
    @MinLength(8)
    password: string;
    
    @IsString()
    confirmPassword: string;
}