import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { UserDTO } from 'src/users/dto/user.dto';

@Injectable()
export class AuthService {

    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService    
    ) {}

    async validateUser(user: UserDTO): Promise< Omit<User, 'password'> > {

        // Get the user entry from DB
        const userEntry = await this.usersService.getUser(user)

        // Compare the passwords from request and DB
        if (user.passwordHash !== userEntry.password) {
            throw new UnauthorizedException('Bad credentials')
        }

        // Delete password from user entry
        const {password, ...result} = userEntry;
        return result
    }

    async login(user: UserDTO) {
        const userEntry = await this.validateUser(user);
        return await this.signPayload({sub: userEntry.id})
    }

    async signPayload(payload: {sub: string}) {
        return {
            access_token: this.jwtService.sign(payload),
        }
    }
}