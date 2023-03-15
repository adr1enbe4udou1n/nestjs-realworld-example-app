import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { TagsModule } from './tags/tags.module';
import { ArticlesModule } from './articles/articles.module';
import { ProfilesModule } from './profiles/profiles.module';
import { UserModule } from './user/user.module';
import { MigrateService } from './migrate.service';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    TagsModule,
    ArticlesModule,
    ProfilesModule,
    UserModule,
    UsersModule,
  ],
  providers: [MigrateService],
})
export class AppModule {}
