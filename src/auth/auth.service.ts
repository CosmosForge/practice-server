import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as dotenv from "dotenv"
import * as argon2 from "argon2"
import { Op } from 'sequelize';
dotenv.config()
@Injectable()
export class AuthService {
    constructor( private jwt:JwtService) {}

    async refreshToken(user){
        return await this.jwt.sign(
            {
                username:user.id,
            },
            {
                secret:process.env.SECRET_KEY,
                expiresIn:process.env.TOKEN_EXPIRATION
            }
        )
    }

    async accesToken(user){
        return await this.jwt.sign(
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
    }

    async verifyToken(token:string): Promise<[boolean, {}]>{
        try {
            const decodedToken = await this.jwt.verify(token, { secret: process.env.SECRET_KEY });
            return [true, decodedToken];
        } catch (error) {
            return [false, {}]
        }
    }
}
