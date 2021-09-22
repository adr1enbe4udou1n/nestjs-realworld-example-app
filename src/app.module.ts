import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { UsersModule } from './users/users.module';
import { TagsModule } from './tags/tags.module';
import { ArticlesModule } from './articles/articles.module';
import { ProfilesModule } from './profiles/profiles.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    MikroOrmModule.forRoot(),
    UsersModule,
    TagsModule,
    ArticlesModule,
    ProfilesModule,
    UserModule,
  ],
  providers: [],
})
export class AppModule {}
