import { plainToClass } from 'class-transformer';
import { User } from 'src/users/user.entity';

export class CurrentUserDTO {
  email: string;
  username: string;
  bio?: string;
  image?: string;
  token: string;

  public static fromUser(user: User): CurrentUserDTO {
    return plainToClass(CurrentUserDTO, {
      username: user.name,
      email: user.email,
      bio: user.bio,
      image: user.image,
      token: 'token',
    });
  }
}

export class UserEnvelope {
  user: CurrentUserDTO;
}
