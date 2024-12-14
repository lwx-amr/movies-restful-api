import { Movie } from '../../movies/types/movie.type';

export type MoviesList = {
  movies: Movie[];
  currentPage: number;
  totalPages: number;
};
