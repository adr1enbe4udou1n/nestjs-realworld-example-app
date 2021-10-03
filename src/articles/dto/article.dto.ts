import { ApiProperty } from '@nestjs/swagger';
import { ProfileDTO } from '../../profiles/dto/profile.dto';
import { Article } from '../article.entity';
import { UserService } from '../../user/user.service';

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
  created_at: Date;

  @ApiProperty()
  updated_at: Date;

  @ApiProperty()
  tagList: string[] = [];

  @ApiProperty()
  author: ProfileDTO;

  @ApiProperty()
  favorited: boolean;

  @ApiProperty()
  favoritesCount: number;

  static map(article: Article, userService: UserService): ArticleDTO {
    const dto = new ArticleDTO();
    dto.title = article.title;
    dto.slug = article.slug;
    dto.description = article.description;
    dto.body = article.body;
    dto.author = ProfileDTO.map(article.author, userService);
    dto.tagList = article.tags.getItems().map((t) => t.name);
    dto.favorited = article.favoredUsers
      .getItems()
      .some((u) => u.id === userService.user?.id);
    dto.favoritesCount = article.favoredUsers.count();
    dto.created_at = article.created_at;
    dto.updated_at = article.updated_at;
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
