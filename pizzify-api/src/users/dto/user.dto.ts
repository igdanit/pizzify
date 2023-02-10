import { MaxLength, IsEmail, IsString } from 'class-validator'

export class UserDTO {
    @MaxLength(30)
    @IsEmail()
    userName: string;

    @MaxLength(32)
    @IsString()
    passwordHash: string;
}