import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from '../auth/auth.service';
@Module({
  imports:[
    SequelizeModule.forFeature([User]),
    JwtModule 
  ],
  controllers: [UserController],
  providers: [UserService, AuthService],
})
export class UserModule {}
