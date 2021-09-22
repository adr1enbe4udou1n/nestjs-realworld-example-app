import { Test, TestingModule } from '@nestjs/testing';
import { UserEnvelope } from '../user/dto/current-user-dto';
import { UsersController } from './users.controller';

describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
    }).compile();

    controller = module.get<UsersController>(UsersController);
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
    ).toStrictEqual<UserEnvelope>({
      user: {
        email: 'john.doe@example.com',
        username: 'John Doe',
        bio: '',
        image: '',
        token: '',
      },
    });
  });
});
