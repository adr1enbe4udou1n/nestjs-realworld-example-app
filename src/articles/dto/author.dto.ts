import { ApiProperty } from '@nestjs/swagger';

export class AuthorDTO {
  @ApiProperty()
  username: string;

  @ApiProperty()
  bio?: string;

  @ApiProperty()
  image?: string;
}
