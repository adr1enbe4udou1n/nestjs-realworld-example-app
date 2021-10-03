import { MikroOrmModule } from '@mikro-orm/nestjs';
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AuthMiddleware } from '../user/auth.middleware';
import { UserService } from '../user/user.service';
import { User } from '../users/user.entity';
import { ProfilesController } from './profiles.controller';
import { ProfilesService } from './profiles.service';

@Module({
  imports: [MikroOrmModule.forFeature([User])],
  controllers: [ProfilesController],
  providers: [ProfilesService, UserService],
})
export class ProfilesModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(ProfilesController);
  }
}
