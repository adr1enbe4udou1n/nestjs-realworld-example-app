import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth.guard';
import { ProfileEnvelope } from './dto/profile.dto';
import { ProfilesService } from './profiles.service';

@Controller('profiles')
@ApiTags('profiles')
export class ProfilesController {
  constructor(private profilesService: ProfilesService) {}

  @Get('celeb_:username')
  @ApiResponse({ type: ProfileEnvelope })
  async get(@Param('username') username: string) {
    return { profile: await this.profilesService.get(username) };
  }

  @UseGuards(AuthGuard)
  @Post('celeb_:username/follow')
  @ApiResponse({ type: ProfileEnvelope })
  async follow(@Param('username') username: string) {
    return { profile: await this.profilesService.follow(username, true) };
  }

  @UseGuards(AuthGuard)
  @Delete('celeb_:username/follow')
  @ApiResponse({ type: ProfileEnvelope })
  async unfollow(@Param('username') username: string) {
    return { profile: await this.profilesService.follow(username, false) };
  }
}
