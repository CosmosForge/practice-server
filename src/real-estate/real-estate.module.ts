import { Module } from '@nestjs/common';
import { RealEstateService } from './real-estate.service';
import { RealEstateController } from './real-estate.controller';
import { AuthService } from 'src/auth/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { SequelizeModule } from '@nestjs/sequelize';
import { RealEstate } from './entities/real-estate.entity';
import { User } from 'src/user/entities/user.entity';

@Module({
  imports:[
    SequelizeModule.forFeature([RealEstate]),
    SequelizeModule.forFeature([User]),
    JwtModule 
  ],
  controllers: [RealEstateController],
  providers: [RealEstateService, AuthService],
})
export class RealEstateModule {}
