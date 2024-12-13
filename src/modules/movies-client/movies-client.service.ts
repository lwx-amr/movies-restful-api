import { Inject, Injectable } from '@nestjs/common';
import { MoviesClientInterface } from './interfaces/movies-client.interface';
import { MOVIES_CLIENT } from '../../utils/constants';
import { Movie } from './types/movie.type';
import { Genre } from './types/genre.type';

@Injectable()
export class MoviesClientService {
  constructor(@Inject(MOVIES_CLIENT) private readonly moviesClient: MoviesClientInterface) {}

  async getPopularMovies(): Promise<Movie[]> {
    return this.moviesClient.fetchMovies();
  }

  async getGenres(): Promise<Genre[]> {
    return this.moviesClient.fetchGenres();
  }
}
