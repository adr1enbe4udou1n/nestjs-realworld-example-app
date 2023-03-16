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

  static map(dto: NewArticleDTO) {
    const article = new Article();
    article.title = dto.title;
    article.description = dto.description;
    article.body = dto.body;
    return article;
  }
}

export class NewArticleRequest {
  @ApiProperty()
  article: NewArticleDTO;
}
