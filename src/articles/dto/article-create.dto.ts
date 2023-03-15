import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Article } from '../article.entity';

export class NewArticleDTO {
  @ApiProperty()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsNotEmpty()
  description: string;

  @ApiProperty()
  @IsNotEmpty()
  body: string;

  @ApiPropertyOptional()
  tagList: string[] = [];

  public map() {
    const article = new Article();
    article.title = this.title;
    article.description = this.description;
    article.body = this.body;
    return article;
  }
}

export class NewArticleRequest {
  @ApiProperty()
  article: NewArticleDTO;
}
