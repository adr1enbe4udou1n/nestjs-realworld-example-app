import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { PagedQuery } from 'src/pagination';
import { Article } from './article.entity';
import { NewArticleRequest } from './dto/article-create.dto';
import { UpdateArticleRequest } from './dto/article-update.dto';
import { ArticlesListQuery } from './queries/articles.query';

@Injectable()
export class ArticlesService {
  list(query: ArticlesListQuery) {
    throw new Error('Method not implemented.');
  }
  feed(query: PagedQuery) {
    throw new Error('Method not implemented.');
  }
  get(slug: string) {
    throw new Error('Method not implemented.');
  }
  create(slug: string, command: NewArticleRequest) {
    throw new Error('Method not implemented.');
  }
  update(slug: string, command: UpdateArticleRequest) {
    throw new Error('Method not implemented.');
  }
  delete(slug: string) {
    throw new Error('Method not implemented.');
  }
  favorite(slug: string, arg1: boolean) {
    throw new Error('Method not implemented.');
  }
  constructor(
    @InjectRepository(Article)
    private readonly tagRepository: EntityRepository<Article>,
  ) {}
}