import { ApiProperty } from '@nestjs/swagger';
import { ProfileDTO } from '../../../profiles/dto/profile.dto';
import { UserService } from '../../../user/user.service';
import { Comment } from '../comment.entity';

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

  static map(comment: Comment, userService: UserService): CommentDTO {
    const dto = new CommentDTO();
    dto.id = comment.id;
    dto.body = comment.body;
    dto.author = ProfileDTO.map(comment.author, userService);
    dto.created_at = comment.created_at;
    dto.updated_at = comment.updated_at;
    return dto;
  }
}

export class SingleCommentResponse {
  @ApiProperty()
  comment: CommentDTO;
}

export class MultipleCommentsResponse {
  @ApiProperty({ type: [CommentDTO] })
  comments: CommentDTO[];
}
