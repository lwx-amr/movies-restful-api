import * as _ from 'lodash';
import { Movie } from '../entities/movie.entity';
import { MovieDto } from '../dtos/movie.dto';

export class MovieView {
  constructor(private readonly data: Movie | Movie[]) {}

  renderOne(): MovieDto {
    if (!Array.isArray(this.data)) {
      return this.renderMovie(this.data);
    }
  }

  renderArray(): MovieDto[] {
    if (Array.isArray(this.data)) {
      return this.data.map((movie) => this.renderMovie(movie));
    }
  }

  renderMovie(movie: Movie): MovieDto {
    const movieData = _.pick(movie, [
      'id',
      'adult',
      'backdropPath',
      'genres',
      'tmdbId',
      'originalLanguage',
      'originalTitle',
      'overview',
      'popularity',
      'posterPath',
      'releaseDate',
      'title',
      'video',
      'voteAverage',
      'voteCount',
      'averageRating',
      'ratingCount',
    ]);
    movieData.genres = movieData.genres && movieData.genres.map((genre) => genre.name);
    return movieData;
  }
}
