import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { UserProfile } from './profile/user-profile';
import { User } from './user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  controllers: [UsersController],
  imports: [MikroOrmModule.forFeature([User])],
  providers: [UsersService, UserProfile],
})
export class UsersModule {}
