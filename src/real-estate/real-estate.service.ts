import { Injectable, UseGuards } from '@nestjs/common';
import { CreateRealEstateDto } from './dto/create-real-estate.dto';
import { UpdateRealEstateDto } from './dto/update-real-estate.dto';
import { CheckUserGuard } from 'src/guards/check-user/check-user.guard';
import { RealEstate } from './entities/real-estate.entity';
import { InjectModel } from '@nestjs/sequelize';
import { User } from 'src/user/entities/user.entity';
import { AuthService } from 'src/auth/auth.service';

@Injectable()

export class RealEstateService {
  constructor(
    @InjectModel(RealEstate) private readonly estate: typeof RealEstate,
    @InjectModel(User) private readonly user: typeof User,
    private auth:AuthService
  ){}

  async create(createRealEstateDto) {
    const access = await this.auth.verifyToken(createRealEstateDto["access-token"])
    if (!access[0]) {
        const refresh = await this.auth.verifyToken(createRealEstateDto["refresh-token"])
        if (!refresh[0]) {
            return { status: 0 }; // Если ни токен доступа, ни токен обновления не прошли проверку
        }
        createRealEstateDto["userId"] = (await this.user.findOne({ where: { username: refresh[1]["username"] } })).id;
        const accessToken = this.auth.accesToken({ ...refresh });
        return { status: 2, obj: await this.estate.create(createRealEstateDto), access: accessToken };
    }
    createRealEstateDto["userId"] = (await this.user.findOne({ where: { username: access[1]["username"] } })).id;
    return { status: 1, obj: await this.estate.create(createRealEstateDto) };
  }
  async findAll(optios:{}) {
    return await this.estate.findAll(optios)
  }
  
  findOne(id: number) {
    return `This action returns a #${id} realEstate`;
  }

  update(id: number, updateRealEstateDto: UpdateRealEstateDto) {
    return `This action updates a #${id} realEstate`;
  }

  remove(id: number) {
    return `This action removes a #${id} realEstate`;
  }
}
