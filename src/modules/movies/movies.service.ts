import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Movie } from './entities/movie.entity';
import { MoviesList } from './types/movies-list.type';
import { RateMovieDto } from './dtos/rate-movie.dto';

@Injectable()
export class MoviesService {
  constructor(
    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,
  ) {}

  async findAll(page: number = 1, limit: number = 10): Promise<MoviesList> {
    const totalCount = await this.movieRepository.count();
    const totalPages = Math.ceil(totalCount / limit);

    if (page > totalPages) {
      throw new NotFoundException(`No movies found on page ${page}.`);
    }

    const movies = await this.movieRepository.find({
      relations: ['genres'],
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      movies: movies.map((movie) => ({
        ...movie,
        genres: movie.genres.map((genre) => genre.id),
      })),
      currentPage: page,
      totalPages,
    };
  }

  async findOne(id: number): Promise<Movie> {
    const movie = await this.movieRepository.findOne({
      where: { id },
      relations: ['genres'],
    });

    if (!movie) {
      throw new NotFoundException(`Movie with ID ${id} not found.`);
    }

    return movie;
  }

  async rateMovie(id: number, rateMovieDto: RateMovieDto): Promise<void> {
    const movie = await this.movieRepository.findOne({ where: { id } });

    if (!movie) {
      throw new NotFoundException(`Movie with ID ${id} not found.`);
    }

    const { rating } = rateMovieDto;

    await this.movieRepository
      .createQueryBuilder()
      .setLock('pessimistic_write')
      .update(Movie)
      .set({
        ratingCount: () => 'ratingCount + 1',
        averageRating: () => `(averageRating * ratingCount + ${rating}) / (ratingCount + 1)`,
      })
      .where('id = :id', { id })
      .execute();
  }
}
