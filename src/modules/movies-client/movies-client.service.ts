import { Inject, Injectable } from '@nestjs/common';
import { MoviesClientInterface } from './interfaces/movies-client.interface';
import { MOVIES_CLIENT } from '../../utils/constants';
import { Genre } from './types/genre.type';
import { MoviesClientList } from './types/movies-list.type';

@Injectable()
export class MoviesClientService {
  constructor(@Inject(MOVIES_CLIENT) private readonly moviesClient: MoviesClientInterface) {}

  async getPopularMovies(page: number): Promise<MoviesClientList> {
    return this.moviesClient.fetchMovies(page);
  }

  async getGenres(): Promise<Genre[]> {
    return this.moviesClient.fetchGenres();
  }
}
