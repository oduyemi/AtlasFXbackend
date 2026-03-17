import { Controller, Post, Body, Get, UseGuards, Req } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { RegisterDto } from "./dto/register.dto";
import { VerifyOtpDto } from "./dto/verify-otp.dto";
import { CompleteRegistrationDto } from "./dto/complete-registration.dto";
import { LoginDto } from "./dto/login.dto";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';


@ApiTags('Auth')
@Controller("auth")
export class AuthController {

  constructor(private authService: AuthService) {}

  @Post("register")
  @ApiOperation({ summary: 'Register user and send OTP' })
  @ApiResponse({ status: 201, description: 'OTP sent successfully' })
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post("verify")
  @ApiOperation({ summary: 'Verify OTP and activate account' })
  @ApiResponse({ status: 201, description: 'Email verified successfully' })

  verify(@Body() dto: VerifyOtpDto) {
    return this.authService.verifyOtp(dto);
  }

  @Post("complete-registration")
  @ApiOperation({ summary: 'Complete registration and choose wallet currencies' })
  @ApiResponse({ status: 201, description: 'Token' })
  complete(@Body() dto: CompleteRegistrationDto) {
    return this.authService.completeRegistration(dto);
  }

  @Post("login")
  @ApiOperation({ summary: 'Log into your account' })
  @ApiResponse({ status: 201, description: 'Token, user details' })
  login(@Body() dto: LoginDto) {
    return this.authService.login(
      dto.email,
      dto.password
    );
  }

  @Post("resend-otp")
  @ApiOperation({ summary: 'Resend OTP to verify and activate account' })
  @ApiResponse({ status: 201, description: 'OTP sent successfully' })
  resend(@Body("email") email: string) {
    return this.authService.resendOtp(email);
  }

  @UseGuards(JwtAuthGuard)
  @Get("profile")
  profile(@Req() req) {
    return this.authService.getProfile(req.user.userId);
  }

}