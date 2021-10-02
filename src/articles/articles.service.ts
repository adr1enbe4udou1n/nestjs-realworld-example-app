import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { PagedQuery } from '../pagination';
import { Article } from './article.entity';
import { NewArticleDTO } from './dto/article-create.dto';
import { UpdateArticleDTO } from './dto/article-update.dto';
import { ArticleDTO } from './dto/article.dto';
import { ArticlesListQuery } from './queries/articles.query';
import { Tag } from '../tags/tag.entity';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(Article)
    private readonly articleRepository: EntityRepository<Article>,
    @InjectRepository(Tag)
    private readonly tagRepository: EntityRepository<Tag>,
    private readonly userService: UserService,
  ) {}

  list(
    query: ArticlesListQuery,
  ): Promise<{ items: ArticleDTO[]; count: number }> {
    throw new Error('Method not implemented.');
  }
  feed(query: PagedQuery): Promise<{ items: ArticleDTO[]; count: number }> {
    throw new Error('Method not implemented.');
  }
  get(slug: string): Promise<ArticleDTO> {
    throw new Error('Method not implemented.');
  }
  create(command: NewArticleDTO): Promise<ArticleDTO> {
    throw new Error('Method not implemented.');
  }
  update(slug: string, command: UpdateArticleDTO): Promise<ArticleDTO> {
    throw new Error('Method not implemented.');
  }
  delete(slug: string) {
    throw new Error('Method not implemented.');
  }
  favorite(slug: string, arg1: boolean): Promise<ArticleDTO> {
    throw new Error('Method not implemented.');
  }
}
