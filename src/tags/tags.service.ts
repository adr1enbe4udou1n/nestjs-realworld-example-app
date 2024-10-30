import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TagsService {
  constructor(private prisma: PrismaService) {}

  async list() {
    return (await this.prisma.tag.findMany({ orderBy: { name: 'asc' } })).map(
      (t) => t.name,
    );
  }
}
