import { ApiProperty } from '@nestjs/swagger';

export class CommentCreateDTO {
  @ApiProperty()
  body: string;
}

export class CommentCreateCommand {
  @ApiProperty()
  comment: CommentCreateDTO;
}
