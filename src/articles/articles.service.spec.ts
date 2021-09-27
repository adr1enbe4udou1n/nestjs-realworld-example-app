import { MikroORM } from '@mikro-orm/core';
import { initializeDbTestBase } from '../db-test-base';
import { ArticlesService } from './articles.service';

describe('ArticlesService', () => {
  let orm: MikroORM;
  let service: ArticlesService;

  beforeEach(async () => {
    const module = await initializeDbTestBase({
      providers: [ArticlesService],
    });

    orm = module.get(MikroORM);
    service = module.get(ArticlesService);
  });

  afterEach(async () => {
    await orm.close(true);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
