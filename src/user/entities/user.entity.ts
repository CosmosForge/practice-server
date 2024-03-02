import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table
export class User extends Model {
    @Column
    username: string;
    
    @Column
    firstName: string;
    
    @Column
    lastName: string;
    
    @Column
    phone: string;
    
    @Column
    address: string;

    @Column
    rating: number;

    @Column
    email: string;
  
    @Column
    password: string;
  
    @Column({
        type: DataType.STRING(500), 
    })
    refreshToken: string;
    
    @Column({
        defaultValue: false,
    })
    confirmStatus: boolean; 
}