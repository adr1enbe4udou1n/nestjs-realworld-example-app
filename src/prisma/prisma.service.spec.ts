import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';

describe('PrismaService', () => {
  let service: PrismaClient;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaClient],
    }).compile();

    service = module.get<PrismaClient>(PrismaClient);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
