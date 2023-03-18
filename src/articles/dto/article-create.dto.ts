import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

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
}

export class NewArticleRequest {
  @ApiProperty()
  article: NewArticleDTO;
}
