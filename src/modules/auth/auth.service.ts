import { Injectable, BadRequestException } from "@nestjs/common";   
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { RegisterDto } from "./dto/register.dto";
import { VerifyOtpDto } from "./dto/verify-otp.dto";
import { CompleteRegistrationDto } from "./dto/complete-registration.dto";
import { User } from "../users/entities/user.entity";
import { Otp } from "./entities/otp.entity";
import { WalletsService } from "../wallets/wallets.service";

   
@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
    
        @InjectRepository(Otp)
        private otpRepository: Repository<Otp>,
        private walletService: WalletsService,
        private jwtService: JwtService
    
    ) {}
    
    generateOtp() {
        return Math.floor(100000 + Math.random() * 900000).toString()
    }
    
    async register(dto: RegisterDto) {
        if (!dto.fname || !dto.lname || !dto.email || !dto.password || !dto.confirmPassword)
        throw new BadRequestException("All fields are required")

        if (dto.password !== dto.confirmPassword)
        throw new BadRequestException("Passwords do not match")

        const existing = await this.userRepository.findOne({
        where: { email: dto.email }
        })
    
        if (existing)
        throw new BadRequestException("User already exists")

        const otpCode = this.generateOtp()
        const expires = new Date()
        expires.setMinutes(expires.getMinutes() + 5)
        await this.otpRepository.save({
        email: dto.email,
        code: otpCode,
        expiresAt: expires
        })
    
        // send email 
        console.log("OTP:", otpCode)
        const hashed = await bcrypt.hash(dto.password, 10)
        const user = this.userRepository.create({
        email: dto.email,
        password: hashed,
        isVerified: false
        })
        await this.userRepository.save(user)
        return {
        message: "OTP sent to email"
        }
    };
    
    async verifyOtp(dto: VerifyOtpDto) {
        const record = await this.otpRepository.findOne({
        where: { email: dto.email, code: dto.otp }
        })
        if (!record)
        throw new BadRequestException("Invalid OTP")
    
        if (record.expiresAt < new Date())
        throw new BadRequestException("OTP expired")
        const user = await this.userRepository.findOne({
        where: { email: dto.email }
        })
        user.isVerified = true
        await this.userRepository.save(user)
        return {
        message: "Email verified"
        }
    };
    
    async completeRegistration(dto: CompleteRegistrationDto) {
        const user = await this.userRepository.findOne({
        where: { email: dto.email }
        })
    
        if (!user || !user.isVerified)
        throw new BadRequestException("User not verified")
        const wallet = await this.walletService.createWallet(user.id)
        const currencies = [
         dto.primaryCurrency,
         ...dto.otherCurrencies
        ]
        
        for(const currency of currencies){
        
         await this.walletService.createCurrency(
          wallet.id,
          currency
         )
        
        }
    
        const token = this.jwtService.sign({
        userId: user.id
        })
        return {
        token
        }
    };

    async login(email:string,password:string){

        const user = await this.usersService.findByEmail(email)
       
        if(!user)
         throw new BadRequestException("Invalid credentials")
       
        const match = await bcrypt.compare(password,user.password)
       
        if(!match)
         throw new BadRequestException("Invalid credentials")
       
        if(!user.isVerified)
         throw new BadRequestException("Email not verified")
       
        const token = this.jwtService.sign({
         userId:user.id
        })
       
        return {
         token,
         user:{
          id:user.id,
          email:user.email
         }
        }
       
    };
}