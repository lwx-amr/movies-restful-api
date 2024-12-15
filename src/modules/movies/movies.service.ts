import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Movie } from './entities/movie.entity';
import { MoviesList } from './types/movies-list.type';
import { RateMovieDto } from './dtos/rate-movie.dto';
import { MovieView } from './views/movie.view';
import { FilterMoviesQueryDto } from './dtos/filter-movies-query.dto';

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
      movies: new MovieView(movies).renderArray(),
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

  async filterMovies(query: FilterMoviesQueryDto): Promise<MoviesList> {
    const { adult, genre, limit = 10, page = 1 } = query;

    const qb = this.movieRepository
      .createQueryBuilder('movie')
      .leftJoinAndSelect('movie.genres', 'genre')
      .skip((page - 1) * limit)
      .take(limit);

    if (adult !== undefined) {
      qb.andWhere('movie.adult = :adult', { adult });
    }

    if (genre) {
      qb.andWhere('genre.name = :genre', { genre });
    }

    if (!adult && !genre) {
      return this.findAll(page, limit);
    }

    const [movies, count] = await Promise.all([qb.getMany(), qb.getCount()]);
    return {
      movies: new MovieView(movies).renderArray(),
      currentPage: page,
      totalPages: Math.ceil(count / limit),
    };
  }

  async searchMovies(query: string, page: number = 1, limit: number = 10): Promise<MoviesList> {
    const qb = this.movieRepository
      .createQueryBuilder('movie')
      .leftJoinAndSelect('movie.genres', 'genre')
      .where('movie.title ILIKE :query', { query: `%${query}%` })
      .orWhere('movie.overview ILIKE :query', { query: `%${query}%` })
      .skip((page - 1) * limit)
      .take(limit);

    const [movies, totalCount] = await qb.getManyAndCount();
    const totalPages = Math.ceil(totalCount / limit);

    const result = {
      movies: new MovieView(movies).renderArray(),
      currentPage: page,
      totalPages,
    };

    return result;
  }
}
