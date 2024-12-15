import { MovieDto } from '../dtos/movie.dto';

export type MoviesList = {
  movies: MovieDto[];
  currentPage: number;
  totalPages: number;
};
