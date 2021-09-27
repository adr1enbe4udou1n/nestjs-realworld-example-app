import { MikroORM } from '@mikro-orm/core';
import { plainToClass } from 'class-transformer';
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
    service = module.get(TagsService);
  });

  afterEach(async () => {
    await orm.close(true);
  });

  it('can list all tags', async () => {
    await orm.em
      .getRepository(Tag)
      .persistAndFlush([
        plainToClass(Tag, { name: 'Tag3' }),
        plainToClass(Tag, { name: 'Tag2' }),
        plainToClass(Tag, { name: 'Tag1' }),
      ]);

    expect(await act(orm, () => service.list())).toEqual([
      'Tag1',
      'Tag2',
      'Tag3',
    ]);
  });
});
