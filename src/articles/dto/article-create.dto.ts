import { ApiProperty } from '@nestjs/swagger';

export class NewArticleDTO {
  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  body: string;

  @ApiProperty()
  tagList: string[];
}

export class NewArticleRequest {
  @ApiProperty()
  article: NewArticleDTO;
}
