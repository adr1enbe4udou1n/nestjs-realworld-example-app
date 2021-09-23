import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { UsersModule } from './users/users.module';
import { TagsModule } from './tags/tags.module';
import { ArticlesModule } from './articles/articles.module';
import { ProfilesModule } from './profiles/profiles.module';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { AutomapperModule } from '@automapper/nestjs';
import { classes } from '@automapper/classes';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MikroOrmModule.forRoot(),
    AutomapperModule.forRoot({
      options: [{ name: 'auto', pluginInitializer: classes }],
      singular: true,
    }),
    UsersModule,
    TagsModule,
    ArticlesModule,
    ProfilesModule,
    UserModule,
  ],
  providers: [],
})
export class AppModule {}
