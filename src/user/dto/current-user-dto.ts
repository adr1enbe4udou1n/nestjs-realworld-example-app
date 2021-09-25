import { Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { User } from 'src/users/user.entity';

@Injectable()
export class CurrentUserDTO {
  email: string;
  username: string;
  bio?: string;
  image?: string;
  token: string;

  static fromUser(user: User, token: string): CurrentUserDTO {
    return plainToClass(CurrentUserDTO, {
      username: user.name,
      email: user.email,
      bio: user.bio,
      image: user.image,
      token,
    });
  }
}

export class UserEnvelope {
  user: CurrentUserDTO;
}
