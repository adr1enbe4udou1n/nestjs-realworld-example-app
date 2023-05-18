import {
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { JwtGuestAuthGuard } from '../auth/jwt-guest-auth.guard';
import { ProfileResponse } from './dto/profile.dto';
import { ProfilesService } from './profiles.service';

@Controller('profiles')
@ApiTags('Profile')
export class ProfilesController {
  constructor(private profilesService: ProfilesService) {}

  @UseGuards(JwtGuestAuthGuard)
  @ApiOperation({
    operationId: 'GetProfileByUsername',
    summary: 'Get a profile',
    description: 'Get a profile of a user of the system. Auth is optional',
  })
  @Get(':username')
  @ApiParam({
    name: 'username',
    description: 'Username of the profile to get',
  })
  @ApiResponse({ type: ProfileResponse })
  async get(
    @Param('username') username: string,
    @Request() req,
  ): Promise<ProfileResponse> {
    return { profile: await this.profilesService.get(username, req.user) };
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    operationId: 'FollowUserByUsername',
    summary: 'Follow a user',
    description: 'Follow a user by username',
  })
  @Post(':username/follow')
  @HttpCode(200)
  @ApiParam({
    name: 'username',
    description: 'Username of the profile you want to follow',
  })
  @ApiResponse({ type: ProfileResponse })
  async follow(
    @Param('username') username: string,
    @Request() req,
  ): Promise<ProfileResponse> {
    return {
      profile: await this.profilesService.follow(username, true, req.user),
    };
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    operationId: 'UnfollowUserByUsername',
    summary: 'Unfollow a user',
    description: 'Unfollow a user by username',
  })
  @Delete(':username/follow')
  @ApiParam({
    name: 'username',
    description: 'Username of the profile you want to unfollow',
  })
  @ApiResponse({ type: ProfileResponse })
  async unfollow(
    @Param('username') username: string,
    @Request() req,
  ): Promise<ProfileResponse> {
    return {
      profile: await this.profilesService.follow(username, false, req.user),
    };
  }
}
