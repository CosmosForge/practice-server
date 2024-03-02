import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { InjectModel } from '@nestjs/sequelize';
import * as argon2 from "argon2"
import { User } from './entities/user.entity';
import * as dotenv from "dotenv"
import {v4 as uuid} from "uuid"
dotenv.config()
@Injectable()
export class UserService {
  constructor(
    private readonly mailerService: MailerService,
    @InjectModel(User)
        private readonly user: typeof User,
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
}
