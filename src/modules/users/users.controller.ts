import { Controller, Post, Body, Get, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { SinginDto } from './dto/sing-in.dto';
import { RefreshTokenGuard } from '../../common/guards/refresh-token.guard';
import { AccessTokenGuard } from '../../common/guards/access-token.guard';
import { ThrottlerGuard } from '@nestjs/throttler';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('signup')
  @UseGuards(ThrottlerGuard)
  async signup(@Body() createUserData: CreateUserDto) {
    return this.usersService.signUp(createUserData);
  }

  @Post('signin')
  @UseGuards(ThrottlerGuard)
  async login(@Body() signInData: SinginDto) {
    return this.usersService.signIn(signInData);
  }

  @Get('refresh')
  @UseGuards(RefreshTokenGuard)
  @UseGuards(ThrottlerGuard)
  @ApiBearerAuth('Bearer')
  async refreshTokens(@Req() req) {
    const userId = req.user['sub'];
    const refreshToken = req.user['refreshToken'];
    return this.usersService.refreshTokens(userId, refreshToken);
  }

  @ApiBearerAuth('Bearer')
  @UseGuards(AccessTokenGuard)
  @UseGuards(ThrottlerGuard)
  @Post('logout')
  async logout(@Req() req) {
    const userId = req.user['sub'];
    await this.usersService.logout(+userId);
    return { message: 'successfully logged out' };
  }
}
