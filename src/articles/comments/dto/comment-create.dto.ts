import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Comment } from '../comment.entity';

export class NewCommentDTO {
  @ApiProperty()
  @IsNotEmpty()
  body: string;

  static map(dto: NewCommentDTO) {
    const comment = new Comment();
    comment.body = dto.body;
    return comment;
  }
}

export class NewCommentRequest {
  @ApiProperty()
  comment: NewCommentDTO;
}
