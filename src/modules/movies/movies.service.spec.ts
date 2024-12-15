import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MoviesService } from './movies.service';
import { Movie } from './entities/movie.entity';
import { NotFoundException } from '@nestjs/common';
import { MovieView } from './views/movie.view';

describe('MoviesService', () => {
  let service: MoviesService;
  let repository: Repository<Movie>;

  const mockMovies = [
    {
      id: 1,
      title: 'Test Movie 1',
      overview: 'Test Overview 1',
      adult: false,
      ratingCount: 10,
      averageRating: 4.5,
      genres: [{ id: 1, name: 'Action' }],
    },
    {
      id: 2,
      title: 'Test Movie 2',
      overview: 'Test Overview 2',
      adult: true,
      ratingCount: 5,
      averageRating: 3.5,
      genres: [{ id: 2, name: 'Drama' }],
    },
  ] as any;

  const mockRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    count: jest.fn(),
    createQueryBuilder: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MoviesService,
        {
          provide: getRepositoryToken(Movie),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<MoviesService>(MoviesService);
    repository = module.get<Repository<Movie>>(getRepositoryToken(Movie));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return paginated movies list', async () => {
      mockRepository.count.mockResolvedValue(20);
      mockRepository.find.mockResolvedValue(mockMovies);

      const result = await service.findAll(1, 10);

      expect(result).toEqual({
        movies: new MovieView(mockMovies).renderArray(),
        currentPage: 1,
        totalPages: 2,
      });
      expect(repository.find).toHaveBeenCalledWith({
        relations: ['genres'],
        skip: 0,
        take: 10,
      });
    });

    it('should throw NotFoundException when page exceeds total pages', async () => {
      mockRepository.count.mockResolvedValue(10);

      await expect(service.findAll(2, 10)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findOne', () => {
    it('should return a movie by id', async () => {
      mockRepository.findOne.mockResolvedValue(mockMovies[0]);

      const result = await service.findOne(1);

      expect(result).toEqual(mockMovies[0]);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['genres'],
      });
    });

    it('should throw NotFoundException when movie not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('rateMovie', () => {
    const mockQueryBuilder = {
      setLock: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      set: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      execute: jest.fn().mockResolvedValue(undefined),
    };

    beforeEach(() => {
      mockRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);
      mockRepository.findOne.mockResolvedValue(mockMovies[0]);
    });

    it('should update movie rating', async () => {
      await service.rateMovie(1, { rating: 5 });

      expect(mockQueryBuilder.setLock).toHaveBeenCalledWith('pessimistic_write');
      expect(mockQueryBuilder.set).toHaveBeenCalled();
      expect(mockQueryBuilder.where).toHaveBeenCalledWith('id = :id', { id: 1 });
      expect(mockQueryBuilder.execute).toHaveBeenCalled();
    });

    it('should throw NotFoundException when movie not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.rateMovie(999, { rating: 5 })).rejects.toThrow(NotFoundException);
    });
  });

  describe('filterMovies', () => {
    const mockQueryBuilder = {
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockResolvedValue(mockMovies),
      getCount: jest.fn().mockResolvedValue(20),
    };

    beforeEach(() => {
      mockRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);
    });

    it('should filter movies by adult content', async () => {
      const result = await service.filterMovies({ adult: true });

      expect(result).toEqual({
        movies: new MovieView(mockMovies).renderArray(),
        currentPage: 1,
        totalPages: 2,
      });
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith('movie.adult = :adult', { adult: true });
    });

    it('should filter movies by genre', async () => {
      const result = await service.filterMovies({ genre: 'Action' });

      expect(result).toEqual({
        movies: new MovieView(mockMovies).renderArray(),
        currentPage: 1,
        totalPages: 2,
      });
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith('genre.name = :genre', { genre: 'Action' });
    });
  });

  describe('searchMovies', () => {
    const mockQueryBuilder = {
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      orWhere: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      getManyAndCount: jest.fn().mockResolvedValue([mockMovies, 20]),
    };

    beforeEach(() => {
      mockRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);
    });

    it('should search movies by query string', async () => {
      const result = await service.searchMovies('test');

      expect(result).toEqual({
        movies: new MovieView(mockMovies).renderArray(),
        currentPage: 1,
        totalPages: 2,
      });
      expect(mockQueryBuilder.where).toHaveBeenCalledWith('movie.title ILIKE :query', { query: '%test%' });
      expect(mockQueryBuilder.orWhere).toHaveBeenCalledWith('movie.overview ILIKE :query', { query: '%test%' });
    });

    it('should handle pagination in search results', async () => {
      await service.searchMovies('test', 2, 5);

      expect(mockQueryBuilder.skip).toHaveBeenCalledWith(5);
      expect(mockQueryBuilder.take).toHaveBeenCalledWith(5);
    });
  });
});
