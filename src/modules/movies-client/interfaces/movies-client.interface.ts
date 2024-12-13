import { Genre } from '../types/genre.type';
import { Movie } from '../types/movie.type';

export interface MoviesClientInterface {
  fetchMovies(): Promise<Movie[]>;
  fetchGenres(): Promise<Genre[]>;
}
