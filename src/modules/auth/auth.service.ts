import { Cron, CronExpression } from "@nestjs/schedule";
import {
  Injectable,
  BadRequestException,
  NotFoundException
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { LessThan, Repository } from "typeorm";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { RegisterDto } from "./dto/register.dto";
import { VerifyOtpDto } from "./dto/verify-otp.dto";
import { CompleteRegistrationDto } from "./dto/complete-registration.dto";
import { User } from "../users/entities/user.entity";
import { Otp } from "./entities/otp.entity";
import { WalletsService } from "../wallets/wallets.service";
import { MailService } from "src/modules/mail/mail.service";


@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(Otp)
    private otpRepository: Repository<Otp>,

    private walletService: WalletsService,
    private jwtService: JwtService,
    private mailService: MailService
  ) {}

  // Generate 6-digit OTP
  generateOtp() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async register(dto: RegisterDto) {
    if (
      !dto.fname ||
      !dto.lname ||
      !dto.email ||
      !dto.password ||
      !dto.confirmPassword
    ) {
      throw new BadRequestException("All fields are required");
    }

    if (dto.password !== dto.confirmPassword) {
      throw new BadRequestException("Passwords do not match");
    }

    const existing = await this.userRepository.findOne({
      where: { email: dto.email }
    });

    if (existing) {
      throw new BadRequestException("User already exists");
    }

    // Remove previous OTPs
    await this.otpRepository.delete({ email: dto.email });

    const otpCode = this.generateOtp();
    const hashedOtp = await bcrypt.hash(otpCode, 10);

    const expires = new Date();
    expires.setMinutes(expires.getMinutes() + 5);

    await this.otpRepository.save({
      email: dto.email,
      code: hashedOtp,
      expiresAt: expires
    });

    // Send OTP
    await this.mailService.sendOtp(dto.email, otpCode);

    if (process.env.NODE_ENV !== "production") {
      console.log("OTP:", otpCode);
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = this.userRepository.create({
      fname: dto.fname,
      lname: dto.lname,
      email: dto.email,
      password: hashedPassword,
      isVerified: false
    });

    await this.userRepository.save(user);

    return {
      message: "OTP sent to email"
    };
  }

  async verifyOtp(dto: VerifyOtpDto) {
    console.log("STEP 1: DTO RECEIVED →", dto);
  
    if (!dto.email || !dto.otp) {
      console.log("STEP 2: Missing fields");
      throw new BadRequestException("Email and OTP are required");
    }
  
    const record = await this.otpRepository.findOne({
      where: { email: dto.email },
      order: { expiresAt: "DESC" }
    });
  
    console.log("STEP 3: OTP RECORD →", record);
  
    if (!record) {
      console.log("STEP 4: No OTP found");
      throw new BadRequestException("Invalid OTP");
    }
  
    const cleanOtp = dto.otp.toString().trim();
    console.log("STEP 5: CLEAN OTP →", cleanOtp);
  
    const isMatch = await bcrypt.compare(cleanOtp, record.code);
    console.log("STEP 6: MATCH RESULT →", isMatch);
  
    if (!isMatch) {
      console.log("STEP 7: OTP mismatch");
      throw new BadRequestException("Invalid OTP");
    }
  
    console.log("STEP 8: EXPIRY CHECK →", record.expiresAt, new Date());
  
    if (record.expiresAt < new Date()) {
      console.log("STEP 9: OTP expired");
      throw new BadRequestException("OTP expired");
    }
  
    const user = await this.userRepository.findOne({
      where: { email: dto.email }
    });
  
    console.log("STEP 10: USER →", user);
  
    if (!user) {
      console.log("STEP 11: User not found");
      throw new NotFoundException("User not found");
    }
  
    if (user.isVerified) {
      console.log("STEP 12: Already verified");
      throw new BadRequestException("User already verified");
    }
  
    user.isVerified = true;
    await this.userRepository.save(user);
  
    await this.otpRepository.delete({ id: record.id });
  
    console.log("STEP 13: SUCCESS");
  
    return {
      message: "Email verified successfully"
    };
  }

  async completeRegistration(dto: CompleteRegistrationDto) {
    console.log("STEP 1: DTO →", dto);
  
    const user = await this.userRepository.findOne({
      where: { email: dto.email }
    });
    console.log("STEP 2: USER →", user);
  
    if (!user || !user.isVerified) {
      throw new BadRequestException("User not verified");
    }
  
    console.log("STEP 3: Creating wallet...");
    const wallet = await this.walletService.createWallet(user.id);
    console.log("STEP 4: WALLET CREATED →", wallet);
  
    const currencies = [dto.primaryCurrency, ...(dto.otherCurrencies || [])];
    for (const currency of currencies) {
      console.log("STEP 5: Adding currency →", currency);
      await this.walletService.createCurrency(wallet.id, currency);
    }
  
    console.log("STEP 6: Signing JWT...");
    const token = this.jwtService.sign({ userId: user.id });
  
    console.log("STEP 7: COMPLETE REGISTRATION SUCCESS");
    return { token };
  }

  async resendOtp(email: string) {
    const user = await this.userRepository.findOne({
      where: { email }
    });

    if (!user) {
      throw new BadRequestException("User not found");
    }

    // 🧹 Remove old OTPs
    await this.otpRepository.delete({ email });

    const otpCode = this.generateOtp();
    const hashedOtp = await bcrypt.hash(otpCode, 10);

    const expires = new Date();
    expires.setMinutes(expires.getMinutes() + 5);

    await this.otpRepository.save({
      email,
      code: hashedOtp,
      expiresAt: expires
    });

    await this.mailService.sendOtp(email, otpCode);

    if (process.env.NODE_ENV !== "production") {
      console.log("Resent OTP:", otpCode);
    }

    return {
      message: "OTP resent to email"
    };
  }

  async login(email: string, password: string) {
    const user = await this.userRepository.findOne({
      where: { email }
    });

    if (!user) {
      throw new BadRequestException("Invalid credentials");
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      throw new BadRequestException("Invalid credentials");
    }

    if (!user.isVerified) {
      throw new BadRequestException("Email not verified");
    }

    const token = this.jwtService.sign({
      userId: user.id
    });

    return {
      token,
      user: {
        id: user.id,
        email: user.email
      }
    };
  }

  async getProfile(userId: number) {
    const user = await this.userRepository.findOne({
      where: { id: userId }
    });

    if (!user) {
      throw new BadRequestException("User not found");
    }

    return {
      id: user.id,
      email: user.email,
      fname: user.fname,
      lname: user.lname,
      verified: user.isVerified
    };
  }

  // CRON: CLEAN EXPIRED OTPS
  @Cron(CronExpression.EVERY_10_MINUTES)
  async cleanupExpiredOtps() {
    await this.otpRepository.delete({
      expiresAt: LessThan(new Date())
    });

    console.log("Expired OTPs cleaned");
  }
}