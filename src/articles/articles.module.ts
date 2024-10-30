import { Module } from '@nestjs/common';
import { ArticlesController } from './articles.controller';
import { CommentsController } from './comments/comments.controller';
import { ArticlesService } from './articles.service';
import { CommentsService } from './comments/comments.service';

@Module({
  controllers: [ArticlesController, CommentsController],
  providers: [ArticlesService, CommentsService],
})
export class ArticlesModule {}
