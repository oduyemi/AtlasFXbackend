import { IsEmail, IsString, MinLength } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';



export class LoginDto {
    @ApiProperty({ example: 'johndoe@gmail.com' })
    @IsEmail()
    email: string

    @ApiProperty({ example: 'Pass1234' })
    @IsString()
    @MinLength(8)
    password: string

}