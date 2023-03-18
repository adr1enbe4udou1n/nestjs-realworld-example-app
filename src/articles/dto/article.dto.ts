import { ApiProperty } from '@nestjs/swagger';
import { ProfileDTO } from '../../profiles/dto/profile.dto';
import {
  Article,
  ArticleFavorite,
  ArticleTag,
  FollowerUser,
  Tag,
  User,
} from '@prisma/client';

export class ArticleDTO {
  @ApiProperty()
  title: string;

  @ApiProperty()
  slug: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  body: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  tagList: string[] = [];

  @ApiProperty()
  author: ProfileDTO;

  @ApiProperty()
  favorited: boolean;

  @ApiProperty()
  favoritesCount: number;

  static map(
    article: Article & {
      favoredUsers: (ArticleFavorite & {
        user: User;
      })[];
      tags: (ArticleTag & {
        tag: Tag;
      })[];
      author: User & {
        following: FollowerUser[];
      };
    },
    currentUser: User | null,
  ) {
    const dto = new ArticleDTO();
    dto.title = article.title;
    dto.slug = article.slug;
    dto.description = article.description;
    dto.body = article.body;
    dto.author = ProfileDTO.map(article.author, currentUser);
    dto.tagList = article.tags.map((t) => t.tag.name).sort();
    dto.favorited = article.favoredUsers.some(
      (u) => u.userId === currentUser?.id,
    );
    dto.favoritesCount = article.favoredUsers.length;
    dto.createdAt = article.createdAt;
    dto.updatedAt = article.updatedAt;
    return dto;
  }
}

export class SingleArticleResponse {
  @ApiProperty()
  article: ArticleDTO;
}

export class MultipleArticlesResponse {
  @ApiProperty({ type: [ArticleDTO] })
  articles: ArticleDTO[];

  @ApiProperty()
  articlesCount: number;
}
