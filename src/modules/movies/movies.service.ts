import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Movie } from './entities/movie.entity';
import { CreateMovieDto } from './dtos/create-movie.dto';
import { UpdateMovieDto } from './dtos/update-movie.dto';

@Injectable()
export class MoviesService {
  constructor(
    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,
  ) {}

  async create(createMovieDto: CreateMovieDto): Promise<Movie> {
    const existingMovie = await this.movieRepository.findOne({
      where: { tmdbId: createMovieDto.tmdbId },
    });

    if (existingMovie) {
      throw new ConflictException(`Movie with TMDB ID ${createMovieDto.tmdbId} already exists.`);
    }

    const movie = this.movieRepository.create({
      ...createMovieDto,
      genres: createMovieDto.genres.map((genreId) => ({ id: genreId })),
    });

    return this.movieRepository.save(movie);
  }

  async findAll(): Promise<Movie[]> {
    const movies = await this.movieRepository.find({ relations: ['genres'] });

    if (!movies || movies.length === 0) {
      throw new NotFoundException('No movies found.');
    }

    return movies;
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

  async update(id: number, updateMovieDto: UpdateMovieDto): Promise<Movie> {
    const existingMovie = await this.movieRepository.findOne({ where: { id } });

    if (!existingMovie) {
      throw new NotFoundException(`Movie with ID ${id} not found.`);
    }

    await this.movieRepository.update(id, updateMovieDto);

    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const existingMovie = await this.movieRepository.findOne({ where: { id } });

    if (!existingMovie) {
      throw new NotFoundException(`Movie with ID ${id} not found.`);
    }

    await this.movieRepository.delete(id);
  }
}
