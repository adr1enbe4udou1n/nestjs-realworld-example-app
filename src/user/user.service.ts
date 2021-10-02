import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from '../users/user.entity';
import { UserDTO } from './dto/current-user.dto';
import { JwtService } from '@nestjs/jwt';
import { UpdateUserDTO } from './dto/update-user.dto';

@Injectable()
export class UserService {
  private _user: User = null;

  public get user() {
    return this._user;
  }

  public set user(user: User) {
    this._user = user;
  }

  public get isAuthenticated() {
    return this._user !== null;
  }

  constructor(
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
    private jwtService: JwtService,
  ) {}

  public async current(): Promise<UserDTO> {
    if (!this.isAuthenticated) {
      throw new UnauthorizedException();
    }

    return UserDTO.map(
      this.user,
      this.jwtService.sign({
        id: this.user.id,
        name: this.user.name,
        email: this.user.email,
      }),
    );
  }

  public async update(updateUserDTO: UpdateUserDTO): Promise<UserDTO> {
    if ((await this.userRepository.count({ email: updateUserDTO.email })) > 0) {
      throw new BadRequestException('This email is already used');
    }

    await this.userRepository.persistAndFlush(updateUserDTO.map(this.user));
    return this.current();
  }

  public async setUserFromToken(token: string) {
    const payload = this.jwtService.verify(token);
    this.fresh(payload.id);
  }

  public async fresh(id: number) {
    this.user = await this.userRepository.findOneOrFail(id);
  }
}
