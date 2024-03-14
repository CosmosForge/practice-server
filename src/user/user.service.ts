import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { InjectModel } from '@nestjs/sequelize';
import * as argon2 from "argon2"
import { User } from './entities/user.entity';
import * as dotenv from "dotenv"
import {v4 as uuid} from "uuid"
import { Op } from 'sequelize';
import { AuthService } from 'src/auth/auth.service';
dotenv.config()
@Injectable()
export class UserService {
  constructor(
    private readonly mailerService: MailerService,
    @InjectModel(User)
        private readonly user: typeof User,
        private readonly auth: AuthService
  ) {}

  async create(user: CreateUserDto, domain:string) {
    const token = uuid()
    const password = user.password
    delete user.confirmPassword
    user.refreshToken = token
    const createdUser = await this.user.create({...user})
    createdUser.password = await argon2.hash(password)
    await createdUser.save()
    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Confirmation Email',
      template: 'confirm', // Имя вашего шаблона, например, 'confirm.ejs'
      context: {
        name:user.firstName,
        lastName:user.lastName,
        link: domain+"/user/confirm-email/"+token
      },
    });
  }

  findAll() {
    return `This action returns all user`;
  }
  findOne(options:{}){
    return this.user.findOne({where:options})
  }
  findById(id: number) {
    return `This action returns a #${id} user`;
  }

  update(updateUserDto: UpdateUserDto, option) {
    return this.user.update(updateUserDto, {where:option})
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
  async logIn(userData:{user:string, password:string}){
    const user = await this.user.findOne({where:{[Op.or]: [{ username: userData.user }, { email: userData.user }]}});
    if(user != null && user.confirmStatus == true){
        const passwordMatches  = await argon2.verify(user.password, userData.password)
        if(passwordMatches){
            const refreshToken = await this.auth.refreshToken(user)
            const accessToken = await this.auth.accesToken(user)
            return {status:true, refreshToken, accessToken}
        }else{
            return {status:false, message:"Incorrect password"}
        }
    }else{
        return {status:false, message:"non-existent username or email"}
    }
}

async confirm(uuid:string){
    const user = await this.user.findOne({where:{refreshToken:uuid}})
    const refreshToken = await this.auth.refreshToken(user)
    const accessToken = await this.auth.accesToken(user)
    this.user.update({confirmStatus:true, refreshToken:refreshToken}, {where:{refreshToken:uuid}})
    return {status:true, refreshToken, accessToken}
}
}
