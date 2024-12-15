import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Watchlist } from './entities/watchlist.entity';
import { MoviesService } from '../movies/movies.service';

@Injectable()
export class WatchlistService {
  constructor(
    @InjectRepository(Watchlist)
    private readonly watchlistRepository: Repository<Watchlist>,
    private readonly moviesService: MoviesService,
  ) {}

  async addToList(userId: number, movieId: number) {
    let watchlist = await this.watchlistRepository.findOne({
      where: { user: { id: userId } },
      relations: ['movies'],
    });

    if (!watchlist) {
      const user = { id: userId };
      watchlist = this.watchlistRepository.create({ user, movies: [] });
      await this.watchlistRepository.save(watchlist);
    }

    const movie = await this.moviesService.findOne(movieId);

    if (!movie) {
      throw new NotFoundException('Movie not found.');
    }

    const isAlreadyInWatchlist = watchlist.movies.some((movie) => movie.id === movieId);
    if (isAlreadyInWatchlist) {
      throw new ConflictException('Movie already exists in the watchlist.');
    }

    watchlist.movies.push(movie);
    return this.watchlistRepository.save(watchlist);
  }

  async removeFromList(userId: number, movieId: number) {
    const watchlist = await this.watchlistRepository
      .createQueryBuilder('watchlist')
      .leftJoinAndSelect('watchlist.movies', 'movie')
      .where('watchlist.userId = :userId', { userId })
      .andWhere('movie.id = :movieId', { movieId })
      .getOne();

    if (!watchlist) {
      throw new NotFoundException('Movie not found in the watchlist.');
    }

    await this.watchlistRepository
      .createQueryBuilder()
      .delete()
      .from('watchlists_movies_movies')
      .where('watchlistsId = :watchlistsId', { watchlistsId: watchlist.id })
      .andWhere('moviesId = :moviesId', { moviesId: movieId })
      .execute();
  }

  async findOneByUserId(userId: number): Promise<Watchlist> {
    const watchlist = await this.watchlistRepository.findOne({
      where: { user: { id: userId } },
      relations: ['movies'],
    });

    if (!watchlist) {
      throw new NotFoundException('Watchlist not found.');
    }

    return watchlist;
  }
}
