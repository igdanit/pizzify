import { PrismaClient } from "@prisma/client"
import { Order as PizzaOrder } from ".prisma/client"

class PrismaService {
    constructor(public prismaClient: PrismaClient) {}

    async addOrder(pizzaOrder: Omit<PizzaOrder, "id">):Promise<PizzaOrder> {
        return await this.prismaClient.order.create({
            data: pizzaOrder
        });
    }

    async getUserLastOrder(userID: string): Promise<PizzaOrder | null> {
        return await this.prismaClient.order.findFirst({
            where: {
                slack_user_id: userID
            },
            orderBy: {
                createdAt: "desc"
            }
        })
    }

    async getPizzaTypes(): Configuration {
        return ["Деревенская", "Классика", "Неополитанская", "Пепперони", "Маргарита", "Четыре сыра"]
    }

    async getPizzaSizes(): Configuration {
        return ["Маленькая", "Средняя", "Большая"]
    }

    async getPizzaThicknesses(): Configuration {
        return ["Тонкое", "Обычное"]
    }    

    async getPizzaCrusts(): Configuration {
        return ["Обычный", "Сырный"]
    }

    async getPizzaToppings(): Configuration {
        return ["Сыр", "Колбаса", "Курица", "Любовь"]
    }

}

type Configuration = Promise<string[]>

const prismaService = new PrismaService(new PrismaClient());
export default prismaService;