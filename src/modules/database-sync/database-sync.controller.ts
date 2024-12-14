import { Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { DatabaseSyncService } from './database-sync.service';

@Controller('sync')
export class DatabaseSyncController {
  constructor(private readonly databaseSyncService: DatabaseSyncService) {}

  @Post('genres')
  @HttpCode(HttpStatus.OK)
  async syncGenres(): Promise<{ message: string }> {
    await this.databaseSyncService.syncGenres();
    return { message: 'Genres synced successfully' };
  }

  @Post('movies')
  @HttpCode(HttpStatus.OK)
  async syncMovies(): Promise<{ message: string }> {
    await this.databaseSyncService.syncMovies();
    return { message: 'Movies synced successfully' };
  }
}
