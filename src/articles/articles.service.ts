import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { BadRequestException, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { PagedQuery } from '../pagination';
import { Article } from './article.entity';
import { NewArticleDTO } from './dto/article-create.dto';
import { UpdateArticleDTO } from './dto/article-update.dto';
import { ArticleDTO } from './dto/article.dto';
import { ArticlesListQuery } from './queries/articles.query';
import { Tag } from '../tags/tag.entity';
import slugify from 'slugify';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(Article)
    private readonly articleRepository: EntityRepository<Article>,
    @InjectRepository(Tag)
    private readonly tagRepository: EntityRepository<Tag>,
    private readonly userService: UserService,
  ) {}

  async list(
    query: ArticlesListQuery,
  ): Promise<{ items: ArticleDTO[]; count: number }> {
    throw new Error('Method not implemented.');
  }

  async feed(
    query: PagedQuery,
  ): Promise<{ items: ArticleDTO[]; count: number }> {
    throw new Error('Method not implemented.');
  }

  async get(slug: string): Promise<ArticleDTO> {
    const article = await this.articleRepository.findOneOrFail({ slug }, [
      'author.followers',
      'tags',
    ]);

    return ArticleDTO.map(article, this.userService);
  }

  async create(dto: NewArticleDTO): Promise<ArticleDTO> {
    if (
      (await this.articleRepository.count({
        slug: slugify(dto.title, { lower: true }),
      })) > 0
    ) {
      throw new BadRequestException('Article with same title already exist');
    }

    const article = dto.map();
    article.author = this.userService.user;

    const existingTags = await this.tagRepository.find({
      name: { $in: dto.tagList },
    });

    article.tags.add(
      ...dto.tagList.map((name) => {
        let tag = existingTags.find((t) => t.name === name);

        if (tag) return tag;

        tag = new Tag();
        tag.name = name;
        return tag;
      }),
    );

    await this.articleRepository.persistAndFlush(article);

    return ArticleDTO.map(article, this.userService);
  }

  async update(slug: string, dto: UpdateArticleDTO): Promise<ArticleDTO> {
    throw new Error('Method not implemented.');
  }

  async delete(slug: string) {
    throw new Error('Method not implemented.');
  }

  async favorite(slug: string, arg1: boolean): Promise<ArticleDTO> {
    throw new Error('Method not implemented.');
  }
}
