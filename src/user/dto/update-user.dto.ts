import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
    username?: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    address?: string;
    rating?: number;
    email?: string;
    password?: string;
    refreshToken?: string;
    confirmStatus?: boolean;
}
