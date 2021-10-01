import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '../auth.guard';
import { ProfileEnvelope } from './dto/profile.dto';
import { ProfilesService } from './profiles.service';

@Controller('profiles')
@ApiTags('Profile')
export class ProfilesController {
  constructor(private profilesService: ProfilesService) {}

  @ApiOperation({
    summary: 'Get a profile',
    description: 'Get a profile of a user of the system. Auth is optional',
  })
  @Get('celeb_:username')
  @ApiResponse({ type: ProfileEnvelope })
  async get(@Param('username') username: string) {
    return { profile: await this.profilesService.get(username) };
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: 'Follow a user',
    description: 'Follow a user by username',
  })
  @Post('celeb_:username/follow')
  @ApiResponse({ type: ProfileEnvelope })
  async follow(@Param('username') username: string) {
    return { profile: await this.profilesService.follow(username, true) };
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: 'Unfollow a user',
    description: 'Unfollow a user by username',
  })
  @Delete('celeb_:username/follow')
  @ApiResponse({ type: ProfileEnvelope })
  async unfollow(@Param('username') username: string) {
    return { profile: await this.profilesService.follow(username, false) };
  }
}
