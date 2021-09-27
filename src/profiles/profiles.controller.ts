import { Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { ProfileEnvelope } from './dto/profile.dto';
import { ProfilesService } from './profiles.service';

@Controller('profiles')
@ApiTags('profiles')
export class ProfilesController {
  constructor(private profileService: ProfilesService) {}

  @Get('celeb_:username')
  @ApiResponse({ type: ProfileEnvelope })
  async get(@Param('username') username: string): Promise<ProfileEnvelope> {
    return { profile: await this.profileService.get(username) };
  }

  @Post('celeb_:username/follow')
  @ApiResponse({ type: ProfileEnvelope })
  async follow(@Param('username') username: string): Promise<ProfileEnvelope> {
    return { profile: await this.profileService.follow(username, true) };
  }

  @Delete('celeb_:username/follow')
  @ApiResponse({ type: ProfileEnvelope })
  async unfollow(
    @Param('username') username: string,
  ): Promise<ProfileEnvelope> {
    return { profile: await this.profileService.follow(username, false) };
  }
}
