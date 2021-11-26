import { Module } from '@nestjs/common';
import { ArticlesController } from './articles.controller';
import { CommentsController } from './comments/comments.controller';
import { ArticlesService } from './articles.service';
import { CommentsService } from './comments/comments.service';
import { Article } from './article.entity';
import { Comment } from './comments/comment.entity';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { User } from '../users/user.entity';
import { Tag } from '../tags/tag.entity';

@Module({
  imports: [MikroOrmModule.forFeature([Article, Tag, Comment, User])],
  controllers: [ArticlesController, CommentsController],
  providers: [ArticlesService, CommentsService],
})
export class ArticlesModule {}
