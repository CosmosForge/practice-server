import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { User } from 'src/user/entities/user.entity';
export enum ActionType {
    Sell = 'sell',
    Rent = 'rent',
    Transfer = 'transfer',
    newConstruct = 'new-construct',
}
export enum realEstateType {
    living = 'living',
    office = 'office',
    shop = 'shop',
    industrial = 'industrial',
    land = 'land',
    investments = 'investments',
    unique = 'unique',
    business = 'business',
}
export enum landType {
    andalucia = 'andalucía',
    aragon = 'aragón',
    asturias = 'asturias',
    baleares = 'baleares',
    canarias = 'canarias',
    cantabria = 'cantabria',
    mancha = 'mancha',
    leon = 'león',
    cataluna = 'cataluña',
    extremadura = 'extremadura',
    Galicia = 'Galicia',
    madrid = 'madrid',
    murcia = 'murcia',
    navarra = 'navarra',
    rioja = 'rioja',
    valenciana = 'valenciana',
    vasco = 'vasco',
    melilla = 'melilla',
    ceuta = 'ceuta',
}
@Table
export class RealEstate extends Model {
    @Column({
        type: DataType.ENUM(...Object.values(ActionType)),
        allowNull: false,
    })
    typeAction: ActionType;

    @Column({
        type: DataType.ENUM(...Object.values(realEstateType)),
        allowNull: false,
    })
    realEstateType: realEstateType;

    @Column({
        type: DataType.ENUM(...Object.values(landType)),
        allowNull: false,
    })
    landType: landType;

    @Column
    roomsCount: number

    @Column({
        type:DataType.DOUBLE,
        allowNull: false,
    })
    area:number

    @Column({
        type:DataType.DATEONLY
    })
    dateConstruction: string

    @Column
    estateStatus: boolean

    @Column({
        type:DataType.TEXT
    })
    description: string

    @Column
    viewsCount: number
    
    @Column
    img: string
    
    @BelongsTo(() => User)
        user: User;
    
        @ForeignKey(() => User)
        @Column({
        type: DataType.INTEGER,
        allowNull: false,
        })
        userId: number;
}