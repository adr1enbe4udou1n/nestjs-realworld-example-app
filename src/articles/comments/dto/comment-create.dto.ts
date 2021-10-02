import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Comment } from '../comment.entity';

export class NewCommentDTO {
  @ApiProperty()
  @IsNotEmpty()
  body: string;

  map(): Comment {
    const comment = new Comment();
    comment.body = this.body;
    return comment;
  }
}

export class NewCommentRequest {
  @ApiProperty()
  comment: NewCommentDTO;
}
