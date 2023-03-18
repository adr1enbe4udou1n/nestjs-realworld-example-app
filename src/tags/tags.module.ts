import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { TagsController } from './tags.controller';
import { TagsService } from './tags.service';

@Module({
  imports: [PrismaModule],
  controllers: [TagsController],
  providers: [TagsService],
})
export class TagsModule {}
