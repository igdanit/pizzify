import { ISlackUser } from "./user"

export interface IOrder {
    id: string,
    type: string,
    size: string,
    thickness: string,
    crust: string,
    toppings: string[],
    address: string,
    comment?: string,
    status: string,
    createdAt: Date,
    slackUser: ISlackUser
}

export enum OrderStatus {
    ACCEPTED = "ACCEPTED",
    COOKING = "COOKING",
    DELIVERING = "DELIVERING",
    DELIVERED = "DELIVERED",
    REJECTED = "REJECTED"
}