import { PrismaClient } from '@prisma/client';
import { initializeDbTestBase, refreshDatabase } from '../db-test-base';
import { TagsService } from './tags.service';

describe('TagsService', () => {
  let prisma: PrismaClient;
  let service: TagsService;

  beforeAll(async () => {
    const module = await initializeDbTestBase({
      providers: [TagsService],
    });

    prisma = module.get(PrismaClient);
    service = await module.resolve(TagsService);
  });

  beforeEach(async () => {
    await refreshDatabase(prisma);
  });

  it('can list all tags', async () => {
    await prisma.tag.createMany({
      data: [{ name: 'Tag3' }, { name: 'Tag2' }, { name: 'Tag1' }],
    });

    expect(await service.list()).toEqual(['Tag1', 'Tag2', 'Tag3']);
  });
});
