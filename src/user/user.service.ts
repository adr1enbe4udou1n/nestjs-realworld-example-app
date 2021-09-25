import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from '../users/user.entity';
import { CurrentUserDTO } from './dto/current-user-dto';
import { JwtService } from '@nestjs/jwt';
import { UpdateUserDTO } from './dto/update-user-dto';

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

  public current() {
    if (!this.user) {
      throw new UnauthorizedException();
    }

    return CurrentUserDTO.fromUser(
      this.user,
      this.jwtService.sign({
        id: this.user.id,
        name: this.user.name,
        email: this.user.email,
      }),
    );
  }

  public async update(updateUserDTO: UpdateUserDTO) {
    this.user.email = updateUserDTO.email;
    await this.userRepository.persistAndFlush(this.user);
    return this.current();
  }

  public async setUserFromToken(token: string) {
    const payload = this.jwtService.verify(token);
    this.user = await this.userRepository.findOneOrFail(payload.id);
  }
}
