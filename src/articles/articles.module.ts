import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ArticlesController } from './articles.controller';
import { CommentsController } from './comments/comments.controller';
import { ArticlesService } from './articles.service';
import { CommentsService } from './comments/comments.service';
import { Article } from './article.entity';
import { Comment } from './comments/comment.entity';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { AuthMiddleware } from '../user/auth.middleware';
import { UserService } from '../user/user.service';
import { User } from '../users/user.entity';

@Module({
  imports: [MikroOrmModule.forFeature([Article, Comment, User])],
  controllers: [ArticlesController, CommentsController],
  providers: [ArticlesService, CommentsService, UserService],
})
export class ArticlesModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(ArticlesController, CommentsController);
  }
}
