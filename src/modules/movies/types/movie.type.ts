export type Movie = {
  adult: boolean;
  backdropPath?: string;
  genres: number[];
  tmdbId: number;
  originalLanguage: string;
  originalTitle?: string;
  overview?: string;
  popularity?: number;
  posterPath?: string;
  releaseDate?: string;
  title: string;
  video?: boolean;
  voteAverage?: number;
  voteCount?: number;
};
