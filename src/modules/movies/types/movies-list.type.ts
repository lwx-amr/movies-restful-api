import { Movie } from './movie.type';

export type MoviesList = {
  movies: Movie[];
  currentPage: number;
  totalPages: number;
};
