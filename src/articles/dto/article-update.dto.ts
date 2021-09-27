import { ApiProperty } from '@nestjs/swagger';

export class ArticleUpdateDTO {
  @ApiProperty()
  body: string;
}

export class ArticleUpdateCommand {
  @ApiProperty()
  article: ArticleUpdateDTO;
}
