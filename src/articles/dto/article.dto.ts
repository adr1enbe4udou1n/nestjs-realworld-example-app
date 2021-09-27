import { ApiProperty } from '@nestjs/swagger';
import { AuthorDTO } from './author.dto';

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
  author: AuthorDTO;

  @ApiProperty()
  favorited: boolean;

  @ApiProperty()
  favoritesCount: number;
}

export class ArticleEnvelope {
  @ApiProperty()
  articles: ArticleDTO;
}

export class ArticlesEnvelope {
  @ApiProperty()
  articles: ArticleDTO[];

  @ApiProperty()
  articlesCount: number;
}
