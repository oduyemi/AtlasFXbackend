import { Controller, Post, Body } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { RegisterDto } from "./dto/register.dto";
import { VerifyOtpDto } from "./dto/verify-otp.dto";
import { CompleteRegistrationDto } from "./dto/complete-registration.dto";
import { LoginDto } from "./dto/login.dto";



@Controller("auth")
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post("register")
    register(@Body() dto: RegisterDto) {
        return this.authService.register(dto)
    }
    
    @Post("verify-otp")
    verify(@Body() dto: VerifyOtpDto) {
        return this.authService.verifyOtp(dto)
    }
    
    @Post("complete-registration")
    complete(@Body() dto: CompleteRegistrationDto) {
        return this.authService.completeRegistration(dto)
    }
    
    @Post("login")
    login(@Body() dto:LoginDto){
        return this.authService.login(
            dto.email,
            dto.password
        )
    };
};