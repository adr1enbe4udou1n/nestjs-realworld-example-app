import { ApiProperty } from '@nestjs/swagger';
import { Comment, FollowerUser, User } from '../../../generated/prisma/client';
import { ProfileDTO } from '../../../profiles/dto/profile.dto';

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

  static map(
    comment: Comment & {
      author: User & {
        following: FollowerUser[];
      };
    },
    currentUser: User | null,
  ) {
    const dto = new CommentDTO();
    dto.id = comment.id;
    dto.body = comment.body;
    dto.author = ProfileDTO.map(comment.author, currentUser);
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
