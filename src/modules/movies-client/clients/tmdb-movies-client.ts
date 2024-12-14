import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpClientProvider } from '../../../shared/http-client/http-client.provider';
import { MoviesClientInterface } from '../interfaces/movies-client.interface';
import { TmdbMovie } from '../types/tmdb-movie.type';
import { Genre } from '../types/genre.type';
import { Movie } from '../../movies/types/movie.type';
import { TmdbMoviesResponse } from '../types/tmdb-movies-response.type';
import { MoviesList } from '../types/movies-list.type';

@Injectable()
export class TMDBMoviesClient implements MoviesClientInterface {
  private readonly apiKey: string;
  private readonly baseUrl: string;

  constructor(
    private readonly httpClient: HttpClientProvider,
    private readonly configService: ConfigService,
  ) {
    this.apiKey = this.configService.get<string>('tmdb.apiKey');
    this.baseUrl = this.configService.get<string>('tmdb.baseUrl');
  }

  async fetchMovies(page: number = 1): Promise<MoviesList> {
    const url = `${this.baseUrl}/movie/popular?api_key=${this.apiKey}&page=${page}`;
    const response = await this.httpClient.get<TmdbMoviesResponse>(url);

    return {
      movies: this.formatMovies(response.data.results),
      currentPage: response.data.page,
      totalPages: response.data.total_pages,
    };
  }

  async fetchGenres(): Promise<Genre[]> {
    const url = `${this.baseUrl}/genre/movie/list?api_key=${this.apiKey}`;
    const response = await this.httpClient.get<{ genres: Genre[] }>(url);
    return response.data.genres;
  }

  formatMovies(movies: TmdbMovie[]): Movie[] {
    return movies.map(({ genre_ids, ...movie }) => ({
      adult: movie.adult ?? null,
      backdropPath: movie.backdrop_path ?? null,
      tmdbId: movie.id ?? null,
      originalLanguage: movie.original_language ?? null,
      originalTitle: movie.original_title ?? null,
      overview: movie.overview ?? null,
      popularity: movie.popularity ?? null,
      posterPath: movie.poster_path ?? null,
      releaseDate: movie.release_date || null,
      title: movie.title ?? null,
      video: movie.video ?? null,
      voteAverage: movie.vote_average ?? null,
      voteCount: movie.vote_count ?? null,
      genres: genre_ids ?? null,
    }));
  }
}
