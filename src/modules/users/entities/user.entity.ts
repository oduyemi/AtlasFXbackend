import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn
 } from "typeorm"
 
 @Entity()
 export class User {
 
  @PrimaryGeneratedColumn()
  id: number
 
  @Column({ unique:true })
  email: string
 
  @Column()
  password: string
 
  @Column({ default:false })
  isVerified: boolean
 
  @CreateDateColumn()
  createdAt: Date
 }