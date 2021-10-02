import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { BadRequestException, Injectable } from '@nestjs/common';
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
      return null;
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

  public async update(dto: UpdateUserDTO): Promise<UserDTO> {
    if (
      dto.email &&
      (await this.userRepository.count({
        email: dto.email,
        id: { $ne: this.user.id },
      })) > 0
    ) {
      throw new BadRequestException('This email is already used');
    }

    await this.userRepository.persistAndFlush(
      UpdateUserDTO.map(dto, this.user),
    );
    return this.current();
  }

  public async setUserFromToken(token: string) {
    const payload = this.jwtService.verify(token);
    this.fresh(payload.id);
  }

  public async fresh(id: number) {
    this.user = await this.userRepository.findOne(id);
  }
}
