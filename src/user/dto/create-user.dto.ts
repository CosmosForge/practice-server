export class CreateUserDto  {
    username: string;
    firstName: string;
    lastName: string;
    phone: string;
    address: string;
    rating?: number;
    email: string;
    password: string;
    confirmPassword?:string
    refreshToken?: string;
    confirmStatus?: boolean;
}