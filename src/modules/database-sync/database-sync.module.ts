import { Module } from '@nestjs/common';
import { DatabaseSyncService } from './database-sync.service';
import { DatabaseSyncController } from './database-sync.controller';
import { MoviesClientModule } from '../movies-client/movies-client.module';
import { MoviesClientService } from '../movies-client/movies-client.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Genre } from '../movies/entities/genre.entity';
import { Movie } from '../movies/entities/movie.entity';

@Module({
  imports: [MoviesClientModule, TypeOrmModule.forFeature([Movie, Genre])],
  controllers: [DatabaseSyncController],
  providers: [DatabaseSyncService, MoviesClientService],
})
export class DatabaseSyncModule {}
