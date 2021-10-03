import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable, Scope } from '@nestjs/common';
import { Tag } from './tag.entity';

@Injectable({ scope: Scope.REQUEST })
export class TagsService {
  constructor(
    @InjectRepository(Tag)
    private readonly tagRepository: EntityRepository<Tag>,
  ) {}

  async list(): Promise<string[]> {
    return (await this.tagRepository.findAll({ orderBy: { name: 'ASC' } })).map(
      (t) => t.name,
    );
  }
}
