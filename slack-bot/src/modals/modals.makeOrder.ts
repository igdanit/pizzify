import {SelectMenuOption, SelectMenuElement} from './UI/selectMenu'
import { Methods, ViewsOpenArguments } from "@slack/web-api";


export function getOrderPizzaModal(
    trigger_id: ViewsOpenArguments['trigger_id'],
    pizzaVariants: SelectMenuOption[],
    pizzaSizes: SelectMenuOption[],
    pizzaThicknesses: SelectMenuOption[],
    pizzaCrusts: SelectMenuOption[],
    pizzaToppings: SelectMenuOption[]
    ): ViewsOpenArguments {
    return {
        trigger_id: trigger_id,
        view: {
            type: "modal",
            callback_id: 'view_pizza_order', 
            title: {
                "type": "plain_text",
                "text": "Выберите пиццу",
                "emoji": true
            },
            blocks: [
                {
                    type: "input",
                    optional: false,
                    block_id: "pizzaType",
                    label: {
                        type: "plain_text",
                        text: "Выберите тип пиццы"
                    },
                    element: {
                        action_id: "selectPizzaType",
                        type: "static_select",
                        placeholder: {
                            type: "plain_text",
                            text: "Выбрать"
                        },
                        options: pizzaVariants
                    }
                },
                {
                    type: "input",
                    optional: false,
                    block_id: "pizzaSize",
                    label: {
                        type: "plain_text",
                        text: "Выберите размер пиццы"
                    },
                    element: {
                        type: "radio_buttons",
                        options: pizzaSizes,
                        action_id: "selectPizzaSize"
                    }
                },               
                {
                    type: "input",
                    optional: false,
                    block_id: "pizzaThickness",
                    label: {
                        type: "plain_text",
                        text: "Выберите тип теста"
                    },
                    element: {
                        type: "radio_buttons",
                        options: pizzaThicknesses,
                        action_id: "selectPizzaThickness"
                    }
                },               
                {
                    type: "input",
                    optional: false,
                    block_id: "pizzaCrust",
                    label: {
                        type: "plain_text",
                        text: "Выберите тип бортика пиццы"
                    },
                    element: {
                        type: "radio_buttons",
                        options: pizzaCrusts,
                        action_id: "selectPizzaCrust"
                    }    
                },
                {               
                    type: "section",
                    block_id: "pizzaToppings",
                    text: {
                        type: "mrkdwn",
                        text: "Добавить в пиццу"
                    },
                    accessory: {
                        action_id: "selectPizzaToppings",
                        type: "multi_static_select",
                        placeholder: {
                            type: "plain_text",
                            text: "Выбрать"
                        },
                        options: pizzaToppings
                    }
                },
                {
                    type: "input",
                    optional: false,
                    block_id: "deliveryAddress",
                    element: {
                        type: "plain_text_input",
                        action_id: "deliveryAddress",
                        placeholder: {
                            type: "plain_text",
                            text: "Куда доставить пиццу?"
                        }
                    },
                    label: {
                        type: "plain_text",
                        text: "Адрес доставки"
                    }
                },
                {
                    type: "input",
                    optional: true,
                    block_id: "orderComment",
                    element: {
                        type: "plain_text_input",
                        action_id: "orderComment",
                        placeholder: {
                            type: "plain_text",
                            text: "..."
                        },
                    },
                    label: {
                        type: "plain_text",
                        text: "Комментарий к заказу"
                    }
                }
            ],
            submit: {
                type: "plain_text",
                text: "Заказать",
                emoji: true
            },
            close: {
                "type": "plain_text",
                "text": "Отмена",
                "emoji": true
            }
        }
    }
}

