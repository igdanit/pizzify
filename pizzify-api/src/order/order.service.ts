import { BadRequestException, Injectable } from '@nestjs/common';
import { Order, Status } from '@prisma/client';
import { OrderPrismaService } from 'src/prisma/prisma.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class OrderService {

    private maxOrdersAmount = 100;

    constructor(
        private orderPrismaService: OrderPrismaService,
        private userService: UsersService
        ) {}

    async getOrders(offset: number, amount: number): Promise<Order[]> {
        if (offset >= 0 && amount <= this.maxOrdersAmount) {
            return this.orderPrismaService.getLastOrders(offset, amount)
        }
        throw new BadRequestException(`offset should be greater or equal 0, amount should be less than ${this.maxOrdersAmount}`)
    }

    async updateOrderStatus(orderID: string, status: Status) {
        return await this.orderPrismaService.updateOrderStatus(orderID, status)
    }

    async attachUserInfoToOrder(order: Order, jwt:string) {
        const response = await this.userService.getUserInfo(order.slack_user_id, jwt);
        const fullOrderInfo: any = {...order};
        delete fullOrderInfo.slack_user_id;
        fullOrderInfo.slackUser = response.data;
        return fullOrderInfo
    }

}