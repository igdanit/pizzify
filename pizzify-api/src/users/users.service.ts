import { ConflictException, Injectable} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';

import { UserPrismaService } from 'src/prisma/prisma.service';
import { UserDTO } from './dto/user.dto';
import { firstValueFrom } from 'rxjs';
import { env } from 'process';

@Injectable()
export class UsersService {

    botUrl = env.SLACK_BOT_API_URL + ':' + (process.env.SLACK_BOT_PORT || "3001")

    constructor(
        private readonly userPrismaService: UserPrismaService,
        private readonly http: HttpService
        ) {}

    // Whether user exist, if true add them to DB.
    async addModerator(user: UserDTO) {
        if (await this.userPrismaService.isUserExist(user)) throw new ConflictException('The moderator already exist')
        return await this.userPrismaService.createModeratorEntry(user);
    }

    async getUser(user: UserDTO) {
        return await this.userPrismaService.getUser(user)
    }

    /**
     * Fetch data from Slack-Bot API
     */
    getUserInfo(slackUserID: string, jwt: string) {
        return firstValueFrom(this.http.get<{userID: string, username: string, userAvatar: string}>(
            `${this.botUrl}/user/${slackUserID}`,
            {
                headers: {
                    Authorization: `Bearer ${jwt}`
                }
            }
        ))
    }

    /**
     * Send message to user 
     */
    notifyUser(slackUserID: string, jwt: string, message: string) {
        return firstValueFrom(this.http.post(
            `${this.botUrl}/user/${slackUserID}`,
            {
                message
            },
            {
                headers: {
                    Authorization: `Bearer ${jwt}`
                }
            }
        ))
    }

}