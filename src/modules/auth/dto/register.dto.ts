import { IsEmail, IsString, MinLength } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';


export class RegisterDto {
    @ApiProperty({ example: 'John' })
    @IsString()
    fname: string;

    @ApiProperty({ example: 'Doe' })
    @IsString()
    lname: string;
    
    @ApiProperty({ example: 'johndoe@gmail.com' })
    @IsEmail()
    email: string;
    
    @ApiProperty({ example: 'Pass1234' })
    @IsString()
    @MinLength(8)
    password: string;
    
    @ApiProperty({ example: 'Pass1234' })
    @IsString()
    confirmPassword: string;
}