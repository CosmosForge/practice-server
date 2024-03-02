import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user.service';
import * as dotenv from "dotenv"
dotenv.config()
@Injectable()
export class AuthService {
    constructor(private readonly userService: UserService, private jwt:JwtService) {}
    async logIn(){
        
        
    }
    async confirm(uuid:string){
        const user = await this.userService.findOne({refreshToken:uuid})
        const refreshToken = this.jwt.sign(
            {
                username:user.id,
            },
            {
                secret:process.env.SECRET_KEY,
                expiresIn:process.env.TOKEN_EXPIRATION
            }
        )
        const accessToken = this.jwt.sign(
            {
                username:user.username,
                name:user.firstName,
                lastName:user.lastName,
                email:user.email,
            },
            {
                secret:process.env.SECRET_KEY,
                expiresIn:"1h"
            }
        )
        this.userService.update({confirmStatus:true, refreshToken:refreshToken}, {refreshToken:uuid})
        return {status:true, refreshToken, accessToken}
    }
}
