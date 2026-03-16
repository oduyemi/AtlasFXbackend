import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./entities/user.entity";


@Injectable()
export class UsersService {
 constructor(

  @InjectRepository(User)
  private userRepository: Repository<User>

 ) {}

 async createUser(email:string,password:string){

  const user = this.userRepository.create({
   email,
   password
  })

  return this.userRepository.save(user)
 }

 async findByEmail(email:string){

  return this.userRepository.findOne({
   where:{email}
  })

 }

 async findById(id:number){

  return this.userRepository.findOne({
   where:{id}
  })

 }

 async verifyUser(email:string){

  const user = await this.findByEmail(email)

  user.isVerified = true

  return this.userRepository.save(user)
 }
}