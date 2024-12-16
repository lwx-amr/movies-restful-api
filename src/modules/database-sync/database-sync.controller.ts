import { Controller, Post, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { DatabaseSyncService } from './database-sync.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AccessTokenGuard } from '../../common/guards/access-token.guard';
import { ThrottlerGuard } from '@nestjs/throttler';

@ApiTags('Sync')
@Controller('sync')
export class DatabaseSyncController {
  constructor(private readonly databaseSyncService: DatabaseSyncService) {}

  @Post('genres')
  @ApiBearerAuth('Bearer')
  @UseGuards(AccessTokenGuard)
  @UseGuards(ThrottlerGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Sync Genres', description: 'Synchronizes genres with the database.' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Genres synced successfully.' })
  async syncGenres(): Promise<{ message: string }> {
    await this.databaseSyncService.syncGenres();
    return { message: 'Genres synced successfully' };
  }

  @Post('movies')
  @ApiBearerAuth('Bearer')
  @UseGuards(AccessTokenGuard)
  @UseGuards(ThrottlerGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Sync Movies', description: 'Synchronizes movies with the database.' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Movies synced successfully.' })
  async syncMovies(): Promise<{ message: string }> {
    await this.databaseSyncService.syncMovies();
    return { message: 'Movies synced successfully' };
  }
}
