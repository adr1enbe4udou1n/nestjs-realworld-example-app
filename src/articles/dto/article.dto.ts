import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/user.entity';
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
  tagList: string[];

  @ApiProperty()
  author: ProfileDTO;

  @ApiProperty()
  favorited: boolean;

  @ApiProperty()
  favoritesCount: number;

  static map(
    article: Article,
    author: User,
    userService: UserService,
  ): ArticleDTO {
    const dto = new ArticleDTO();
    dto.title = article.title;
    dto.description = article.description;
    dto.body = article.body;
    dto.author = ProfileDTO.map(author, userService);
    dto.tagList = article.tags.getItems().map((t) => t.name);
    dto.favorited = false;
    dto.favoritesCount = 0;
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
