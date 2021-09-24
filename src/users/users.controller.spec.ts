import { classes } from '@automapper/classes';
import { AutomapperModule } from '@automapper/nestjs';
import { MikroORM } from '@mikro-orm/core';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { RegisterDTO } from './dto/register-dto';
import { UserProfile } from './profile/user-profile';
import { User } from './user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;
  let orm: MikroORM;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ envFilePath: '.env.testing' }),
        MikroOrmModule.forRoot(),
        MikroOrmModule.forFeature([User]),
        AutomapperModule.forRoot({
          options: [{ name: 'auto', pluginInitializer: classes }],
          singular: true,
        }),
      ],
      controllers: [UsersController],
      providers: [UsersService, UserProfile],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
    orm = module.get<MikroORM>(MikroORM);
  });

  it.each([
    {
      email: 'john.doe',
      username: 'John Doe',
      password: 'password',
    },
    {
      email: 'john.doe@example.com',
    },
    {
      email: 'john.doe@example.com',
      username: 'John Doe',
      password: 'pass',
    },
  ])('should not register with invalid data', async (data) => {
    await expect(() =>
      new ValidationPipe().transform(data, {
        type: 'body',
        metatype: RegisterDTO,
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('should register new users', async () => {
    expect(
      await controller.register({
        user: {
          email: 'john.doe@example.com',
          username: 'John Doe',
          password: 'password',
        },
      }),
    ).toStrictEqual({
      user: {
        email: 'john.doe@example.com',
        username: 'John Doe',
        bio: '',
        image: '',
        token: 'token',
      },
    });
  });
});
