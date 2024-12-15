import { MovieView } from './movie.view';
import { Movie } from '../entities/movie.entity';
import { MovieDto } from '../dtos/movie.dto';

describe('MovieView', () => {
  const mockMovie: Movie = {
    id: 1,
    tmdbId: 101,
    adult: false,
    backdropPath: '/mock-backdrop.jpg',
    originalLanguage: 'en',
    originalTitle: 'Mock Original Title',
    overview: 'Mock Overview',
    popularity: 7.5,
    posterPath: '/mock-poster.jpg',
    releaseDate: '2024-12-15',
    title: 'Mock Title',
    video: false,
    voteAverage: 8.3,
    voteCount: 200,
    averageRating: 4.5,
    ratingCount: 150,
    genres: [
      { id: 1, name: 'Action' },
      { id: 2, name: 'Drama' },
    ],
  };

  const mockMovies: Movie[] = [
    {
      ...mockMovie,
      id: 2,
      tmdbId: 102,
      title: 'Mock Title 2',
    },
    {
      ...mockMovie,
      id: 3,
      tmdbId: 103,
      title: 'Mock Title 3',
    },
  ];

  it('should render a single movie correctly', () => {
    const movieView = new MovieView(mockMovie);
    const result = movieView.renderOne();

    const expected: MovieDto = {
      id: 1,
      adult: false,
      backdropPath: '/mock-backdrop.jpg',
      genres: ['Action', 'Drama'],
      tmdbId: 101,
      originalLanguage: 'en',
      originalTitle: 'Mock Original Title',
      overview: 'Mock Overview',
      popularity: 7.5,
      posterPath: '/mock-poster.jpg',
      releaseDate: '2024-12-15',
      title: 'Mock Title',
      video: false,
      voteAverage: 8.3,
      voteCount: 200,
      averageRating: 4.5,
      ratingCount: 150,
    };

    expect(result).toEqual(expected);
  });

  it('should render an array of movies correctly', () => {
    const movieView = new MovieView(mockMovies);
    const result = movieView.renderArray();

    const expected: MovieDto[] = [
      {
        id: 2,
        adult: false,
        backdropPath: '/mock-backdrop.jpg',
        genres: ['Action', 'Drama'],
        tmdbId: 102,
        originalLanguage: 'en',
        originalTitle: 'Mock Original Title',
        overview: 'Mock Overview',
        popularity: 7.5,
        posterPath: '/mock-poster.jpg',
        releaseDate: '2024-12-15',
        title: 'Mock Title 2',
        video: false,
        voteAverage: 8.3,
        voteCount: 200,
        averageRating: 4.5,
        ratingCount: 150,
      },
      {
        id: 3,
        adult: false,
        backdropPath: '/mock-backdrop.jpg',
        genres: ['Action', 'Drama'],
        tmdbId: 103,
        originalLanguage: 'en',
        originalTitle: 'Mock Original Title',
        overview: 'Mock Overview',
        popularity: 7.5,
        posterPath: '/mock-poster.jpg',
        releaseDate: '2024-12-15',
        title: 'Mock Title 3',
        video: false,
        voteAverage: 8.3,
        voteCount: 200,
        averageRating: 4.5,
        ratingCount: 150,
      },
    ];

    expect(result).toEqual(expected);
  });

  it('should return undefined for single movie render when data is an array', () => {
    const movieView = new MovieView(mockMovies);
    const result = movieView.renderOne();
    expect(result).toBeUndefined();
  });

  it('should return undefined for array movie render when data is a single movie', () => {
    const movieView = new MovieView(mockMovie);
    const result = movieView.renderArray();
    expect(result).toBeUndefined();
  });
});
