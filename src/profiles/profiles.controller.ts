import {
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '../auth.guard';
import { ProfileResponse } from './dto/profile.dto';
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
  @ApiParam({
    name: 'username',
    description: 'Username of the profile to get',
  })
  @ApiResponse({ type: ProfileResponse })
  async get(@Param('username') username: string): Promise<ProfileResponse> {
    return { profile: await this.profilesService.get(username) };
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: 'Follow a user',
    description: 'Follow a user by username',
  })
  @Post('celeb_:username/follow')
  @HttpCode(200)
  @ApiParam({
    name: 'username',
    description: 'Username of the profile you want to follow',
  })
  @ApiResponse({ type: ProfileResponse })
  async follow(@Param('username') username: string): Promise<ProfileResponse> {
    return { profile: await this.profilesService.follow(username, true) };
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: 'Unfollow a user',
    description: 'Unfollow a user by username',
  })
  @Delete('celeb_:username/follow')
  @ApiParam({
    name: 'username',
    description: 'Username of the profile you want to unfollow',
  })
  @ApiResponse({ type: ProfileResponse })
  async unfollow(
    @Param('username') username: string,
  ): Promise<ProfileResponse> {
    return { profile: await this.profilesService.follow(username, false) };
  }
}
