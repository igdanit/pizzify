import { Body, Controller, Post } from '@nestjs/common';
import { UserDTO } from 'src/users/dto/user.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {

    constructor(
        private readonly authService: AuthService,
        ){}

    // Issue JWT
    @Post('sign-in')
    async signIn(@Body() user: UserDTO) {
        return await this.authService.login(user)
    }
}