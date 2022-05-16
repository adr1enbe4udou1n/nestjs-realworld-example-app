import { EntityRepository } from '@mikro-orm/postgresql';
import { InjectRepository } from '@mikro-orm/nestjs';
import { User } from '../users/user.entity';
import { verify } from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { UserDTO } from '../user/dto/current-user.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
    private jwtService: JwtService,
  ) {}

  public async validateUser(
    email: string,
    password: string,
  ): Promise<User | null> {
    const user = await this.userRepository.findOne({ email });

    if (!user?.password) {
      return null;
    }

    if (!(await verify(user.password, password))) {
      return null;
    }

    return user;
  }

  public async getUserWithToken(user: User) {
    return UserDTO.map(
      user,
      this.jwtService.sign({
        username: user.name,
        sub: user.id,
      }),
    );
  }
}
