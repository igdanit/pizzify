import { Module } from '@nestjs/common';
import { OrderPrismaService, UserPrismaService } from './prisma.service';

@Module({
  providers: [UserPrismaService, OrderPrismaService],
  exports: [UserPrismaService, OrderPrismaService],
})
export class PrismaModule {}
