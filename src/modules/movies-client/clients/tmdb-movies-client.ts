import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpClientProvider } from '../../../shared/http-client/http-client.provider';
import { MoviesClientInterface } from '../interfaces/movies-client.interface';
import { Movie } from '../types/movie.type';
import { Genre } from '../types/genre.type';

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

  async fetchMovies(): Promise<Movie[]> {
    const url = `${this.baseUrl}/movie/popular?api_key=${this.apiKey}`;
    const response = await this.httpClient.get<{ results: Movie[] }>(url);
    return response.data.results;
  }

  async fetchGenres(): Promise<Genre[]> {
    const url = `${this.baseUrl}/genre/movie/list?api_key=${this.apiKey}`;
    const response = await this.httpClient.get<{ genres: Genre[] }>(url);
    return response.data.genres;
  }
}
