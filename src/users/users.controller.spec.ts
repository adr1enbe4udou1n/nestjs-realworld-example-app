import { MikroORM } from '@mikro-orm/core';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { plainToClass } from 'class-transformer';
import { CurrentUserDTO } from '../user/dto/current-user-dto';
import { RegisterDTO } from './dto/register-dto';
import { User } from './user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;
  let orm: MikroORM;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ envFilePath: '.env.testing' }),
        MikroOrmModule.forRoot(),
        MikroOrmModule.forFeature([User]),
      ],
      controllers: [UsersController],
      providers: [UsersService],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    orm = module.get<MikroORM>(MikroORM);

    await orm.em.nativeDelete(User, {});
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
        user: plainToClass(RegisterDTO, {
          email: 'john.doe@example.com',
          username: 'John Doe',
          password: 'password',
        }),
      }),
    ).toStrictEqual({
      user: plainToClass(CurrentUserDTO, {
        email: 'john.doe@example.com',
        username: 'John Doe',
        bio: null,
        image: null,
        token: 'token',
      }),
    });
  });
});
