import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { TagsModule } from './tags/tags.module';
import { ArticlesModule } from './articles/articles.module';
import { ProfilesModule } from './profiles/profiles.module';
import { UserModule } from './user/user.module';
import { MigrateService } from './migrate.service';
import { ConfigModule } from '@nestjs/config';
import { MikroOrmModule } from '@mikro-orm/nestjs';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MikroOrmModule.forRoot(),
    TagsModule,
    ArticlesModule,
    ProfilesModule,
    UserModule,
    UsersModule,
  ],
  providers: [MigrateService],
})
export class AppModule {}
