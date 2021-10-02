import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, ValidateIf } from 'class-validator';
import { Article } from '../article.entity';

export class UpdateArticleDTO {
  @ApiProperty()
  @ValidateIf((a) => a.title !== null)
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @ValidateIf((a) => a.description !== null)
  @IsNotEmpty()
  description: string;

  @ApiProperty()
  @ValidateIf((a) => a.body !== null)
  @IsNotEmpty()
  body: string;

  static map(dto: UpdateArticleDTO, article: Article): Article {
    article.title = dto.title ?? article.title;
    article.description = dto.description ?? article.description;
    article.body = dto.body ?? article.body;
    return article;
  }
}

export class UpdateArticleRequest {
  @ApiProperty()
  article: UpdateArticleDTO;
}
