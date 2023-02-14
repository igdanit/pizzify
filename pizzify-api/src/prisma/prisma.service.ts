import { INestApplication, Injectable, OnModuleInit, UnauthorizedException } from '@nestjs/common';
import { Order, PrismaClient, Status, User} from '@prisma/client';
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

}

@Injectable()
export class UserPrismaService extends PrismaService {
    
    // Create moderator entry
    async createModeratorEntry(user: UserDTO) {
        return await this.createUserEntry(user, Role.MODERATOR);
    }
    
    // Create entry with specified Role
    async createUserEntry(user: UserDTO, role: Role): Promise<User> {
        return await this.user.create({ data: {
            username: user.username,
            password: user.password,
            role: role
        }});
    }
    
    // Fetch user entry
    async getUser(user: UserDTO): Promise<User> {
        const userEntry = await this.user.findUnique({
            where: {
                username: user.username
            }
        })
        if (userEntry === null || user.password !== userEntry.password) throw new UnauthorizedException("Bad credentials")
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

@Injectable()
export class OrderPrismaService extends PrismaService {

    async getLastOrders(offset: number, amount: number):Promise<Order[]> {
        return this.order.findMany({
            skip: offset,
            take: amount,
            orderBy: {
                createdAt: 'desc'
            }
        })
    }

    async updateOrderStatus(orderID: string, orderStatus: Status): Promise<Order> {
        return await this.order.update({
            where: {
                id: orderID
            },
            data: {
                status: orderStatus
            }
        })
    }

}