import { MikroOrmModule } from '@mikro-orm/nestjs';
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { User } from '../users/user.entity';
import { AuthMiddleware } from './auth.middleware';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [MikroOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(UserController);
  }
}
