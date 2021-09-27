import { MikroORM } from '@mikro-orm/core';
import { initializeDbTestBase } from '../../db-test-base';
import { CommentsService } from './comments.service';

describe('CommentsService', () => {
  let orm: MikroORM;
  let service: CommentsService;

  beforeEach(async () => {
    const module = await initializeDbTestBase({
      providers: [CommentsService],
    });

    orm = module.get(MikroORM);
    service = module.get(CommentsService);
  });

  afterEach(async () => {
    await orm.close(true);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
