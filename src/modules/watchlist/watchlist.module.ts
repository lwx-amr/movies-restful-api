import { Module } from '@nestjs/common';
import { WatchlistService } from './watchlist.service';
import { WatchlistController } from './watchlist.controller';
import { Watchlist } from './entities/watchlist.entity';
import { Movie } from '../movies/entities/movie.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MoviesModule } from '../movies/movies.module';

@Module({
  imports: [MoviesModule, TypeOrmModule.forFeature([Watchlist, Movie])],
  controllers: [WatchlistController],
  providers: [WatchlistService],
})
export class WatchlistModule {}
