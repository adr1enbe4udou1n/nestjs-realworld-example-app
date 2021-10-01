import { ApiProperty } from '@nestjs/swagger';
import { ProfileDTO } from '../../profiles/dto/profile.dto';

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
