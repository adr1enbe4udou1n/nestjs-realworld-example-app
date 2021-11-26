import { Module } from '@nestjs/common';
import { CoreModule } from './core.module';
import { UsersModule } from './users/users.module';
import { TagsModule } from './tags/tags.module';
import { ArticlesModule } from './articles/articles.module';
import { ProfilesModule } from './profiles/profiles.module';
import { UserModule } from './user/user.module';
import { MigrateService } from './migrate.service';

@Module({
  imports: [
    CoreModule,
    TagsModule,
    ArticlesModule,
    ProfilesModule,
    UserModule,
    UsersModule,
  ],
  providers: [MigrateService],
})
export class AppModule {}
