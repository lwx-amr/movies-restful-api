import { Movie } from 'src/modules/movies/types/movie.type';

export type MoviesClientList = {
  movies: Movie[];
  currentPage: number;
  totalPages: number;
};
