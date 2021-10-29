import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { BadRequestException, Injectable, Scope } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { PagedQuery } from '../pagination';
import { Article } from './article.entity';
import { NewArticleDTO } from './dto/article-create.dto';
import { UpdateArticleDTO } from './dto/article-update.dto';
import { ArticleDTO } from './dto/article.dto';
import { ArticlesListQuery } from './queries/articles.query';
import { Tag } from '../tags/tag.entity';
import slugify from 'slugify';

@Injectable({ scope: Scope.REQUEST })
export class ArticlesService {
  constructor(
    @InjectRepository(Article)
    private readonly articleRepository: EntityRepository<Article>,
    @InjectRepository(Tag)
    private readonly tagRepository: EntityRepository<Tag>,
    private readonly userService: UserService,
  ) {}

  limit(query: PagedQuery) {
    const max = 20;
    return Math.min(query.limit ?? max, max);
  }

  async list(query: ArticlesListQuery): Promise<[ArticleDTO[], number]> {
    const articles = await this.articleRepository.find({
      ...(query.author && {
        author: { name: { $like: `%${query.author}%` } },
      }),
      ...(query.tag && {
        tags: { name: query.tag },
      }),
      ...(query.favorited && {
        favoredUsers: { name: { $like: `%${query.favorited}%` } },
      }),
    });

    const [items, count] = await this.articleRepository.findAndCount(
      {
        id: { $in: articles.map((a) => a.id) },
      },
      ['author.followers', 'tags', 'favoredUsers'],
      { id: 'DESC' },
      this.limit(query),
      query.offset,
    );

    return [items.map((a) => ArticleDTO.map(a, this.userService)), count];
  }

  async feed(query: PagedQuery): Promise<[ArticleDTO[], number]> {
    const [items, count] = await this.articleRepository.findAndCount(
      {
        author: { followers: { id: this.userService.user.id } },
      },
      ['author.followers', 'tags', 'favoredUsers'],
      { id: 'DESC' },
      this.limit(query),
      query.offset,
    );

    return [items.map((a) => ArticleDTO.map(a, this.userService)), count];
  }

  async get(slug: string): Promise<ArticleDTO> {
    const article = await this.articleRepository.findOneOrFail({ slug }, [
      'author.followers',
      'tags',
      'favoredUsers',
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

    const article = NewArticleDTO.map(dto);
    article.author = this.userService.user;

    const existingTags = await this.tagRepository.find({
      name: { $in: dto.tagList },
    });

    article.tags.add(
      ...dto.tagList.map((name) => {
        const tag = existingTags.find((t) => t.name === name);

        if (tag) return tag;

        return new Tag({ name });
      }),
    );

    await this.articleRepository.persistAndFlush(article);

    return ArticleDTO.map(article, this.userService);
  }

  async update(slug: string, dto: UpdateArticleDTO): Promise<ArticleDTO> {
    const article = await this.articleRepository.findOneOrFail({ slug }, [
      'author.followers',
      'tags',
      'favoredUsers',
    ]);

    if (article.author.id !== this.userService.user.id) {
      throw new BadRequestException(
        'You cannot edit article from other authors',
      );
    }

    await this.articleRepository.persistAndFlush(
      UpdateArticleDTO.map(dto, article),
    );

    return ArticleDTO.map(article, this.userService);
  }

  async delete(slug: string) {
    const article = await this.articleRepository.findOneOrFail({ slug }, [
      'comments',
    ]);

    if (article.author.id !== this.userService.user.id) {
      throw new BadRequestException(
        'You cannot edit article from other authors',
      );
    }

    await this.articleRepository.removeAndFlush(article);
  }

  async favorite(slug: string, favorite: boolean): Promise<ArticleDTO> {
    const article = await this.articleRepository.findOneOrFail({ slug }, [
      'tags',
      'favoredUsers',
      'author.followers',
    ]);

    const favoredUser = article.favoredUsers
      .getItems()
      .find((u) => u.id === this.userService.user.id);

    if (favorite) {
      if (!favoredUser) {
        article.favoredUsers.add(this.userService.user);
      }
    } else {
      if (favoredUser) {
        article.favoredUsers.remove(favoredUser);
      }
    }

    await this.articleRepository.flush();

    return ArticleDTO.map(article, this.userService);
  }
}
