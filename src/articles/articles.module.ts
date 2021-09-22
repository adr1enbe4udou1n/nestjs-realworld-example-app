import { Module } from '@nestjs/common';
import { ArticlesController } from './articles.controller';
import { CommentsController } from './comments/comments.controller';

@Module({
  controllers: [ArticlesController, CommentsController],
})
export class ArticlesModule {}
