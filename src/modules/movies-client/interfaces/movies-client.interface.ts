import { Genre } from '../types/genre.type';
import { MoviesList } from '../types/movies-list.type';

export interface MoviesClientInterface {
  fetchMovies(page: number): Promise<MoviesList>;
  fetchGenres(): Promise<Genre[]>;
}
