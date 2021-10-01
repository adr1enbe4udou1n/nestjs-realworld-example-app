import { ApiProperty } from '@nestjs/swagger';
import { ProfileDTO } from '../../../profiles/dto/profile.dto';

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
  author: ProfileDTO;
}

export class SingleCommentResponse {
  @ApiProperty()
  comment: CommentDTO;
}

export class MultipleCommentsResponse {
  @ApiProperty({ type: [CommentDTO] })
  comments: CommentDTO[];
}
