import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./entities/user.entity";


@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>
        ) {};
    
        async createUser(email: string, password: string) {
        const user = this.userRepository.create({
        email,
        password
        })
        return this.userRepository.save(user)
        };
    
        async findByEmail(email: string) {
        return this.userRepository.findOne({
        where: { email }
        })
        };
    
        async findById(id: number) {
        const user = await this.userRepository.findOne({
        where: { id }
        })
        if (!user)
            throw new NotFoundException("User not found")
        return user
        };
    
    
        async verifyUser(email: string) {
        const user = await this.findByEmail(email)
        user.isVerified = true
        return this.userRepository.save(user)
        }
    
        async getUserProfile(userId: number) {
        const user = await this.findById(userId)
    
        return {
            id: user.id,
            email: user.email,
            verified: user.isVerified
        }
    };
}