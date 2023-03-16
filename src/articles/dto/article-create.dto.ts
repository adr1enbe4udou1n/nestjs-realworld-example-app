import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import slugify from 'slugify';

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
    article.slug = slugify(dto.title, { lower: true });
    article.description = dto.description;
    article.body = dto.body;
    return article;
  }
}

export class NewArticleRequest {
  @ApiProperty()
  article: NewArticleDTO;
}
