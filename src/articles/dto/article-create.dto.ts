import { ApiProperty } from '@nestjs/swagger';

export class ArticleCreateDTO {
  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  body: string;

  @ApiProperty()
  tagList: string[];
}

export class ArticleCreateCommand {
  @ApiProperty()
  article: ArticleCreateDTO;
}
