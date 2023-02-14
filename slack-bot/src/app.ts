import { SETTINGS } from './settings';
import { App, LogLevel, PlainTextElement, PlainTextOption} from '@slack/bolt';
import { getOrderPizzaModal } from './modals/modals.makeOrder';
import { createSelectMenuOptions, SelectMenuOption } from './modals/UI/selectMenu';
import prismaService from './prisma/prisma.service'
import { Status as STATUS, Order as pizzaOrder } from '.prisma/client'
import { OrderStatus } from './utils/phrases'

import server from './server';

let pizzaVariants: SelectMenuOption[];
let pizzaSizes: SelectMenuOption[];
let pizzaThicknesses: SelectMenuOption[];
let pizzaCrusts: SelectMenuOption[];
let pizzaToppings: SelectMenuOption[];

export const slackApp = new App({
    token: SETTINGS.SLACK_BOT_TOKEN,
    signingSecret: SETTINGS.SLACK_SIGNING_SECRET,
    socketMode: true,
    appToken: SETTINGS.SLACK_APP_TOKEN,
    logLevel: LogLevel.DEBUG,
    port: Number(SETTINGS.SLACK_BOT_PORT) || 3001,
})

slackApp.command('/order', async ({command, ack, body, client}) => {
    await ack();
    await client.views.open(getOrderPizzaModal(body.trigger_id, pizzaVariants, pizzaSizes, pizzaThicknesses, pizzaCrusts, pizzaToppings))
});

slackApp.command('/order_status', async ({command, ack, body, client, logger}) => {
    let msg: string;
    let lastOrder: pizzaOrder | null;
    await ack();

    try{
        lastOrder = await prismaService.getUserLastOrder(command.user_id);
    } catch(e) {
        logger.error(e);
        lastOrder = null
    } 
    
    msg = lastOrder === null ? "У Вас нет последних заказов" :`${OrderStatus[lastOrder.status]} - ${lastOrder.size} ${lastOrder.type.toLowerCase()} пицца`

    
    client.chat.postMessage({
        channel: body.user_id,
        text: msg
    })
});

slackApp.message('', async ({ message, say}) => {
    console.log(message)
    await say({
        blocks: [
            {
                type: 'section',
                text: {
                    type: 'mrkdwn',
                    text: `Чтобы заказать пиццу введите /order \nЧтобы проверить статус последнего заказа введите /order_status`,
                },
            },
        ],
    })
});


// Handling view_submission payload from /order command.
slackApp.view("view_pizza_order", async ({ ack, body, view, client, logger }) => {
    await ack();
    let msg: string = ""; // Response message
    const fields = view.state.values // modal window values
    const userID = body.user.id
    console.log(body)
    const [
        orderPizzaType,
        orderPizzaSize,
        orderPizzaThickness,
        orderPizzaCrust,
        orderPizzaToppings,
        orderPizzaAddress,
        orderPizzaComment,
    ] = [
        fields.pizzaType.selectPizzaType.selected_option?.value,
        fields.pizzaSize.selectPizzaSize.selected_option?.value,
        fields.pizzaThickness.selectPizzaThickness.selected_option?.value,
        fields.pizzaCrust.selectPizzaCrust.selected_option?.value,
        fields.pizzaToppings.selectPizzaToppings.selected_options?.map((option)=>option.value) || [],
        fields.deliveryAddress.deliveryAddress.value?.trim(),
        fields.orderComment.orderComment.value?.trim()
    ]

    if ([orderPizzaType, orderPizzaSize, orderPizzaThickness, orderPizzaCrust,  orderPizzaAddress].every((param) => param !== undefined)) {
        // Save order in DB
        try {
            await prismaService.addOrder({
                type: orderPizzaType as string,
                size: orderPizzaSize as string,
                thickness: orderPizzaThickness as string, 
                crust: orderPizzaCrust as string,
                toppings: orderPizzaToppings,
                address: orderPizzaAddress as string,
                comment: orderPizzaComment as string, 
                status: STATUS.ACCEPTED,
                slack_user_id: userID,
                createdAt: new Date()
            })
            msg = "Ваш заказ принят"
        } catch(e) { logger.error(e) }
    } 

    // Respond to user
    client.chat.postMessage({
        channel: userID,
        text: msg || "Что-то пошло не так, попробуйте снова"
    })

})

slackApp.action("selectPizzaType", async ({ack}) => {
    await ack();
});

slackApp.action("selectPizzaToppings", async ({ack}) => {
    await ack();
});

(async () => {
    // App level variables. Updating when appropriate API endpoint is triggered.
    pizzaVariants = createSelectMenuOptions(await prismaService.getPizzaTypes());
    pizzaSizes = createSelectMenuOptions(await prismaService.getPizzaSizes());
    pizzaThicknesses = createSelectMenuOptions(await prismaService.getPizzaThicknesses());
    pizzaCrusts = createSelectMenuOptions(await prismaService.getPizzaCrusts());
    pizzaToppings = createSelectMenuOptions(await prismaService.getPizzaToppings());
    
    await slackApp.start();

    console.log('__________________BOT____IS____RUNNING__________________')

    await server(); //ExpressJs server. Responsible for fetching userData and sending notification to user.
})();
