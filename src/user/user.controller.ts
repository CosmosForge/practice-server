import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Res, BadRequestException } from '@nestjs/common';
import { UserService } from './user.service';
import { Request, Response } from 'express';
import { AuthService } from '../auth/auth.service';
import * as dotenv from "dotenv"
import { CreateUserDto } from './dto/create-user.dto';
import { Op } from 'sequelize';
dotenv.config()
// const refreshToken = await paseto.V3.encrypt(, Buffer.concat([Buffer.from(process.env.SECRET_KEY)], 32))
interface login{
  user:string
  password:string
}
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Post("auth/login")
  async login(@Body() userData:login , @Res() res: Response){
    const obj = await this.userService.logIn(userData)
    if(obj.status){
      res.cookie("access-token", obj.accessToken)
      res.cookie("refresh-token", obj.refreshToken)
      res.status(200).send();
    }else{
      throw new BadRequestException(obj.message);
    }
  }
  @Get('auth/logout')
  logout(@Res() res: Response) {
    res.clearCookie('access-token');
    res.clearCookie('refresh-token');
    return res.status(200).send({ message: 'Logged out successfully' });
  }
  @Get("confirm-email/:uuid")
  async confirm(@Param("uuid") uuid:string, @Res() res: Response){
    const obj = await this.userService.confirm(uuid)
    if(obj.status){
      res.cookie("access-token", obj.accessToken)
      res.cookie("refresh-token", obj.refreshToken)
      res.header('Location', `${process.env.DOMAIN_FRONT}/user/dashboard`);
      res.status(302).send();
    }
  }
  @Post()
  async create(@Body() createUserDto: CreateUserDto, @Req() request: Request) {
    const user = await this.userService.findOne({[Op.or]: [
      { username: createUserDto.username },
      { email: createUserDto.email },
    ]});
    if (!user) {
      return this.userService.create({...createUserDto}, request.protocol + '://' + request.get('Host'));
    } else {
      throw new BadRequestException('A user with the same name or email already exists in the database');
    }
  }
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.userService.update(+id, updateUserDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
