import { Controller, Get, Param, ParseIntPipe, Patch, Query, Body, Headers, UseGuards } from '@nestjs/common';
import { Order, Status } from '@prisma/client';

import { OrderService } from './order.service';
import { UsersService } from './../users/users.service'
import { OrderStatus } from 'src/utils';
import { JwtAuthGuards } from 'src/auth/auth.jwt-guard';

@UseGuards(JwtAuthGuards)
@Controller('order')
export class OrderController {

    constructor(
        private orderService: OrderService,
        private userService: UsersService
        ) {}

    @Get()
    async getOrders(
        @Query('offset', ParseIntPipe) offset: number,
        @Query('amount', ParseIntPipe) amount: number,
        @Headers('Authorization') bearerToken: string
    ) {
        const jwt = bearerToken.split(" ")[1];
        const orders = await this.orderService.getOrders(offset, amount) // Obtain orders from DB
        const APIrequests = orders.map((order: Order) => this.orderService.attachUserInfoToOrder(order, jwt)) // Fetch user info from bot-api
        return await Promise.all(APIrequests)
    }

    @Patch(':orderID')
    async updateOrderStatus(
        @Param('orderID') orderID: string,
        @Body() data: {status: Status},
        @Headers('Authorization') bearerToken: string
    ) {
        const jwt = bearerToken.split(" ")[1];
        const order: Order = await this.orderService.updateOrderStatus(orderID, data.status);
        this.userService.notifyUser(
            order.slack_user_id,
            jwt,
            `Ваша ${order.type} ${order.size} пицца уже ${OrderStatus[order.status]}`
        )
    }
}
