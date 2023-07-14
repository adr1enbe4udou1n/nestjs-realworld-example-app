import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class TagsService {
  constructor(private prisma: PrismaClient) {}

  async list() {
    return (await this.prisma.tag.findMany({ orderBy: { name: 'asc' } })).map(
      (t) => t.name,
    );
  }
}
