import { ApiProperty } from '@nestjs/swagger';
import { ProfileDTO } from '../../profiles/dto/profile.dto';
import { Article } from '../article.entity';
import { User } from '../../users/user.entity';

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

  static map(article: Article, currentUser: User | null) {
    const dto = new ArticleDTO();
    dto.title = article.title;
    dto.slug = article.slug;
    dto.description = article.description;
    dto.body = article.body;
    dto.author = ProfileDTO.map(article.author, currentUser);
    dto.tagList = article.tags
      .toArray()
      .map((t) => t.name)
      .sort();
    dto.favorited = article.favoredUsers
      .toArray()
      .some((u) => u.id === currentUser?.id);
    dto.favoritesCount = article.favoredUsers.count();
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
