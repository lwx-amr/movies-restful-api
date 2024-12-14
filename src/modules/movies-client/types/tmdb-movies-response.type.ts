import { TmdbMovie } from './tmdb-movie.type';

export type TmdbMoviesResponse = {
  results: TmdbMovie[];
  page: number;
  total_pages: number;
};
