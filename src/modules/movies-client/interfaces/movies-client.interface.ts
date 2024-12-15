import { Genre } from '../types/genre.type';
import { MoviesClientList } from '../types/movies-list.type';

export interface MoviesClientInterface {
  fetchMovies(page: number): Promise<MoviesClientList>;
  fetchGenres(): Promise<Genre[]>;
}
