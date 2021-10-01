import { ApiProperty } from '@nestjs/swagger';

export class UpdateArticleDTO {
  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  body: string;
}

export class UpdateArticleRequest {
  @ApiProperty()
  article: UpdateArticleDTO;
}
