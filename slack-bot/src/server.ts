import express, { Request, Response } from 'express';

import { slackApp } from './app';
import { SETTINGS } from './settings';

export default async() => {
    const app = express();

    app.use(express.json()); // Apply json parser

    /**
     * Handling fetch userData request
     */
    app.get('/user/:userID', async (req: Request, res: Response) => {
        const userID = req.params.userID;
        const userProfile = await slackApp.client.users.profile.get({
            user: userID
        });
        res.send({
            userID: userID,
            username: userProfile.profile?.real_name_normalized,
            userAvatar: userProfile.profile?.image_original,
        })
    })

    /**
     * Sending message to user
     */
    app.post('/user/:userID', async (req: Request, res: Response) => {
        await slackApp.client.chat.postMessage({
            channel: req.params.userID,
            text: req.body.message
        });
        res.statusCode = 201;
        res.send();
    })

    app.listen(SETTINGS.PORT || 3001)
}