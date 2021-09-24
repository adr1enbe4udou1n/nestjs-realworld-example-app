import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import type { Mapper } from '@automapper/types';
import { Injectable } from '@nestjs/common';
import { User } from '../user.entity';
import { CurrentUserDTO } from '../../user/dto/current-user-dto';
import { RegisterDTO } from '../dto/register-dto';
import { mapFrom } from '@automapper/core';

@Injectable()
export class UserProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }
  mapProfile() {
    return (mapper: Mapper) => {
      mapper
        .createMap(User, CurrentUserDTO)
        .forMember(
          (dest) => dest.username,
          mapFrom((src) => src.name),
        )
        .forMember(
          (dest) => dest.token,
          mapFrom(() => 'token'),
        );

      mapper.createMap(RegisterDTO, User).forMember(
        (dest) => dest.name,
        mapFrom((src) => src.username),
      );
    };
  }
}
