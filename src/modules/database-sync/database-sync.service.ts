import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { MoviesClientService } from '../movies-client/movies-client.service';
import { Movie } from '../movies/entities/movie.entity';
import { Genre } from '../movies/entities/genre.entity';
import { Movie as MovieType } from '../movies/types/movie.type';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DatabaseSyncService {
  constructor(
    private readonly configService: ConfigService,

    private readonly moviesClientService: MoviesClientService,
    @InjectRepository(Movie) private readonly movieRepository: Repository<Movie>,
    @InjectRepository(Genre) private readonly genreRepository: Repository<Genre>,
  ) {}

  async syncGenres(): Promise<void> {
    const genres = await this.moviesClientService.getGenres();

    const genreEntities = genres.map((genre) =>
      this.genreRepository.create({
        id: genre.id,
        name: genre.name,
      }),
    );
    await this.genreRepository.save(genreEntities);
  }

  async syncMovies(): Promise<void> {
    const allMovies: MovieType[] = [];
    let currentPage = 1;
    let totalPages = 1;

    do {
      const {
        movies,
        currentPage: fetchedPage,
        totalPages: fetchedTotalPages,
      } = await this.moviesClientService.getPopularMovies(currentPage);

      allMovies.push(...movies);

      currentPage = fetchedPage + 1;
      totalPages = fetchedTotalPages;
    } while (currentPage <= totalPages && currentPage <= this.configService.get<number>('tmdb.maxPages'));

    const movieTmdbIds = allMovies.map((movie) => movie.tmdbId);

    const existingMovies = await this.movieRepository.find({
      where: { tmdbId: In(movieTmdbIds) },
      select: ['tmdbId'],
    });

    const existingMovieIds = new Set(existingMovies.map((movie) => movie.tmdbId));

    const newMovies = allMovies.filter((movie) => !existingMovieIds.has(movie.tmdbId));

    if (newMovies.length > 0) {
      console.log('Saving new movies', { numberOfMovies: newMovies.length });
      const newMovieEntities = newMovies.map((movie) => {
        return {
          ...movie,
          genres: movie.genres.map((id) => ({ id })),
        };
      });
      await this.movieRepository.save(newMovieEntities);
    }
  }
}
