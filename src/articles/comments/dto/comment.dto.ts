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
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  author: ProfileDTO;

  static map(comment: Comment, userService: UserService): CommentDTO {
    const dto = new CommentDTO();
    dto.id = comment.id;
    dto.body = comment.body;
    dto.author = ProfileDTO.map(comment.author, userService);
    dto.createdAt = comment.createdAt;
    dto.updatedAt = comment.updatedAt;
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
