import { MikroORM } from '@mikro-orm/core';
import { act, initializeDbTestBase } from '../db-test-base';
import { Tag } from './tag.entity';
import { TagsService } from './tags.service';

describe('TagsService', () => {
  let orm: MikroORM;
  let service: TagsService;

  beforeEach(async () => {
    const module = await initializeDbTestBase({
      providers: [TagsService],
    });

    orm = module.get(MikroORM);
    service = await module.resolve(TagsService);
  });

  afterEach(async () => {
    await orm.close(true);
  });

  it('can list all tags', async () => {
    await orm.em
      .fork()
      .getRepository(Tag)
      .persistAndFlush([
        new Tag({ name: 'Tag3' }),
        new Tag({ name: 'Tag2' }),
        new Tag({ name: 'Tag1' }),
      ]);

    expect(await act(orm, () => service.list())).toEqual([
      'Tag1',
      'Tag2',
      'Tag3',
    ]);
  });
});
