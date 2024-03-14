import { ActionType, landType, realEstateType } from "../entities/real-estate.entity";

export class CreateRealEstateDto {
    typeAction: ActionType;

    realEstateType: realEstateType;

    landType: landType;

    roomsCount: number

    area:number

    dateConstruction: string

    estateStatus: boolean

    description: string

    viewsCount: number
    
    img: string
}
