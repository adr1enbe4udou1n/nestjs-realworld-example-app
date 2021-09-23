import { classes } from '@automapper/classes';
import { AutomapperModule } from '@automapper/nestjs';
import { MikroORM } from '@mikro-orm/core';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { User } from './user.entity';
import { UsersService } from './users.service';

describe('UsersService', () => {
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
      providers: [UsersService],
    }).compile();

    service = module.get<UsersService>(UsersService);
    orm = module.get<MikroORM>(MikroORM);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
