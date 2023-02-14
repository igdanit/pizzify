import { PlainTextElement, PlainTextOption } from "@slack/bolt";

export class SelectMenuElement implements PlainTextElement {
    type: "plain_text" = "plain_text"

    constructor(public text: string) {}
}

export class SelectMenuOption implements PlainTextOption {
    constructor (
        public text: PlainTextElement,
        public value?: string
        ) {}
}

export function createSelectMenuOptions(options: string[]): SelectMenuOption[] {
    return options.map((option: string) => new SelectMenuOption(new SelectMenuElement(option), option))
}