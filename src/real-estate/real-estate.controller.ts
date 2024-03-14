import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, Req, Res } from '@nestjs/common';
import { RealEstateService } from './real-estate.service';
import { UpdateRealEstateDto } from './dto/update-real-estate.dto';
import { FileInterceptor } from '@nestjs/platform-express/multer';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Request, Response } from 'express';
@Controller('real-estate')
export class RealEstateController {
  constructor(private readonly realEstateService: RealEstateService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './public/imgs/uploads', // Папка для сохранения загруженных файлов
        filename: (req, file, callback) => {
          const currentDate = new Date();
          const formattedDate = currentDate.toISOString().replace(/:/g, '-').substring(0, 19);
          const randomName = Array(32).fill(null).map(() => Math.round(Math.random() * 16).toString(16)).join('');
          return callback(null, `${formattedDate+"-"+randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async create(@Body() createRealEstateDto, @UploadedFile() image, @Req() req: Request, @Res() res: Response) {
    const refreshToken = req.cookies["refresh-token"];
    const accessToken = req.cookies["access-token"];
    createRealEstateDto["refresh-token"] = refreshToken
    createRealEstateDto["access-token"] = accessToken
    createRealEstateDto["img"] = image.path.replace(/\\/g,"/")
    return await this.realEstateService.create(createRealEstateDto)
  }
  
  @Get()
  async findAll() {
    return this.realEstateService.findAll({});
  }

  @Get("user-populars")
  async userPopelars(){
    return await this.realEstateService.findAll({
      order:["viewsCount"]
    })
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.realEstateService.findOne(+id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateRealEstateDto: UpdateRealEstateDto) {
    return this.realEstateService.update(+id, updateRealEstateDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.realEstateService.remove(+id);
  }
}
