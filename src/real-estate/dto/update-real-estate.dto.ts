import { PartialType } from '@nestjs/mapped-types';
import { CreateRealEstateDto } from './create-real-estate.dto';
import { ActionType, landType, realEstateType } from '../entities/real-estate.entity';

export class UpdateRealEstateDto extends PartialType(CreateRealEstateDto) {
    typeAction?: ActionType;

    realEstateType?: realEstateType;

    landType?: landType;

    roomsCount?: number

    area?:number

    dateConstruction?: string

    estateStatus?: boolean

    description?: string

    viewsCount?: number
    
    img?: string
}
