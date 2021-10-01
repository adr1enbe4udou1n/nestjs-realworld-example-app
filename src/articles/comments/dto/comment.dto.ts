import { ApiProperty } from '@nestjs/swagger';
import { AuthorDTO } from '../../dto/author.dto';

export class CommentDTO {
  @ApiProperty()
  id: number;

  @ApiProperty()
  body: string;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;

  @ApiProperty()
  author: AuthorDTO;
}

export class CommentEnvelope {
  @ApiProperty()
  comment: CommentDTO;
}

export class MultipleCommentsResponse {
  @ApiProperty()
  comments: CommentDTO[];
}
