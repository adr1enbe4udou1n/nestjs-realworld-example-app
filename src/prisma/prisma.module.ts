import { Module } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Module({
  providers: [PrismaClient],
  exports: [PrismaClient],
})
export class PrismaModule {}
