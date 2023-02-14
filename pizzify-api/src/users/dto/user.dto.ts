import { MaxLength, IsString } from 'class-validator'

export class UserDTO {
    @MaxLength(30)
    username: string;

    @MaxLength(32)
    @IsString()
    password: string;
}