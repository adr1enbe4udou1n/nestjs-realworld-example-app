import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDTO {
  @ApiProperty()
  username: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  bio: string;

  @ApiProperty()
  image: string;
}

export class UpdateUserRequest {
  @ApiProperty()
  user: UpdateUserDTO;
}
