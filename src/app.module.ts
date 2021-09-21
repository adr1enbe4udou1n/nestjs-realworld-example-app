import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { UsersModule } from './users/users.module';
import { TagModule } from './tag/tag.module';
import { ArticleModule } from './article/article.module';
import { ProfileModule } from './profile/profile.module';

@Module({
  imports: [MikroOrmModule.forRoot(), UsersModule, TagModule, ArticleModule, ProfileModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
