import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDTO {
  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;
}

export class LoginUserRequest {
  @ApiProperty()
  user: LoginUserDTO;
}
