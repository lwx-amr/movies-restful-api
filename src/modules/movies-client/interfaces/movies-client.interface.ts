import { Genre } from '../types/genre.type';
import { MoviesList } from '../../movies/types/movies-list.type';

export interface MoviesClientInterface {
  fetchMovies(page: number): Promise<MoviesList>;
  fetchGenres(): Promise<Genre[]>;
}
