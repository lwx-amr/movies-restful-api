import { Module } from '@nestjs/common';
import { HttpClientProvider } from 'src/shared/http-client/http-client.provider';
import { MoviesClientService } from './movies-client.service';
import { TMDBMoviesClient } from './clients/tmdb-movies-client';
import { MOVIES_CLIENT } from '../../utils/constants';

@Module({
  providers: [
    HttpClientProvider,
    {
      provide: MOVIES_CLIENT,
      useClass: TMDBMoviesClient,
    },
    MoviesClientService,
  ],
  exports: [MoviesClientService, MOVIES_CLIENT],
})
export class MoviesClientModule {}
