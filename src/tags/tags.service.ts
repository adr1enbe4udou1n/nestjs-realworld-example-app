import { EntityRepository } from '@mikro-orm/postgresql';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Tag } from './tag.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tag)
    private readonly tagRepository: EntityRepository<Tag>,
  ) {}

  async list() {
    return (await this.tagRepository.findAll({ orderBy: { name: 'ASC' } })).map(
      (t) => t.name,
    );
  }
}
