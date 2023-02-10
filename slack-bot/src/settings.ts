import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({
    path: resolve(__dirname, '../../.env')
});

export const SETTINGS: {[key: string]: string | undefined} = {
    SLACK_BOT_TOKEN: process.env.SLACK_BOT_TOKEN,
    SLACK_SIGNING_SECRET: process.env.SLACK_SIGNING_SECRET,
    SLACK_APP_TOKEN: process.env.SLACK_APP_TOKEN,
    PORT: process.env.SLACK_BOT_PORT
}