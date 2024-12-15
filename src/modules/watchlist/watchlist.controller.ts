import { Controller, Post, Delete, Body, Param, HttpCode, HttpStatus, Req, UseGuards, Get } from '@nestjs/common';
import { ApiTags, ApiResponse, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { WatchlistService } from './watchlist.service';
import { AddToWatchlistDto } from './dto/add-to-watchlist.dto';
import { AccessTokenGuard } from '../../common/guards/access-token.guard';

@ApiTags('Watchlist')
@Controller('watchlist')
export class WatchlistController {
  constructor(private readonly watchlistService: WatchlistService) {}

  @ApiBearerAuth('Bearer')
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth('Bearer')
  @Post('add')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Add a movie to the watchlist' })
  @ApiResponse({ status: 200, description: 'Movie added to the watchlist successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid request.' })
  async addToList(@Req() req, @Body() addToWatchlistDto: AddToWatchlistDto) {
    const userId = req.user['sub'];
    return this.watchlistService.addToList(userId, addToWatchlistDto.movieId);
  }

  @ApiBearerAuth('Bearer')
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth('Bearer')
  @Delete('remove/:movieId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Remove a movie from the watchlist' })
  @ApiResponse({ status: 200, description: 'Movie removed from the watchlist successfully.' })
  @ApiResponse({ status: 404, description: 'Movie or Watchlist not found.' })
  async removeFromList(@Req() req, @Param('movieId') movieId: number) {
    const userId = req.user['sub'];
    return this.watchlistService.removeFromList(userId, movieId);
  }

  @ApiBearerAuth('Bearer')
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth('Bearer')
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Get the user's watchlist" })
  @ApiResponse({ status: 200, description: "User's watchlist retrieved successfully." })
  @ApiResponse({ status: 404, description: 'Watchlist not found.' })
  getUserWatchlist(@Req() req) {
    const userId = req.user['sub'];
    return this.watchlistService.findOneByUserId(userId);
  }
}
