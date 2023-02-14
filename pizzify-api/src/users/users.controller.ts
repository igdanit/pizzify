import { Controller, UseGuards } from '@nestjs/common';
import { JwtAuthGuards } from 'src/auth/auth.jwt-guard';


@UseGuards(JwtAuthGuards)
@Controller('user')
export class UsersController {}