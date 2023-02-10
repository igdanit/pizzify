import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserDTO } from './dto/user.dto';

@Injectable()
export class UsersService {

    constructor(private readonly prismaService: PrismaService) {}

    // Whether user exist, if true add them to DB.
    async addModerator(user: UserDTO) {
        if (await this.prismaService.isUserExist(user)) throw new ConflictException('The moderator already exist')
        return await this.prismaService.createModeratorEntry(user);
    }

    async getUser(user: UserDTO) {
        return await this.prismaService.getUser(user)
    }
}