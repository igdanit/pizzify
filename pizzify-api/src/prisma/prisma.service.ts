import { INestApplication, Injectable, OnModuleInit, UnauthorizedException } from '@nestjs/common';
import { PrismaClient} from '@prisma/client';
import { UserDTO } from 'src/users/dto/user.dto';
import { Role } from '.prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit{
    
    // Establish connection
    async onModuleInit() {
        await this.$connect();
    }

    // Shutdown hook
    async enableShutdownHooks(app: INestApplication) {
        this.$on('beforeExit', async () => {
            await app.close();
        });
    }

    // Create moderator entry
    async createModeratorEntry(user: UserDTO) {
        return await this.createUserEntry(user, Role.MODERATOR);
    }

    // Create entry with specified Role
    async createUserEntry(user: UserDTO, role: Role) {
        return await this.user.create({ data: {
            username: user.userName,
            password: user.passwordHash,
            role: role
        }});
    }

    // Fetch user entry
    async getUser(user: UserDTO) {
        const userEntry = await this.user.findUnique({
            where: {
                username: user.userName
            }
        })
        if (userEntry === null || user.passwordHash !== userEntry.password) throw new UnauthorizedException("Bad credentials")
        return userEntry
    }

    // Check whether user exist or not
    async isUserExist(user: UserDTO): Promise<boolean> {
        try {
            await this.getUser(user);
            return true
        } catch (e) {
            if (e instanceof UnauthorizedException) {
                return false
            }
            throw e
        }
    }
}