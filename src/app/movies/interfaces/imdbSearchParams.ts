export type ImdbSortOrder = 'ASC' | 'DESC';
export type ImdbSortField = 'id' | 'primaryTitle' | 'averageRating' | 'numVotes' | 'startYear';
export type ImdbType = 'movie' | 'tvSeries' | 'tvEpisode' | 'short' | 'video';
export type ImdbGenre =
  | 'Action'
  | 'Adventure'
  | 'Animation'
  | 'Biography'
  | 'Comedy'
  | 'Crime'
  | 'Documentary'
  | 'Drama'
  | 'Family'
  | 'Fantasy'
  | 'History'
  | 'Horror'
  | 'Music'
  | 'Musical'
  | 'Mystery'
  | 'Romance'
  | 'Sci-Fi'
  | 'Sport'
  | 'Thriller'
  | 'War'
  | 'Western'
  | string;

export interface ImdbSearchParams {
  originalTitle?: string;
  primaryTitle?: string;
  primaryTitleAutocomplete?: string;
  type?: ImdbType;
  genre?: ImdbGenre;
  genres?: string[];
  isAdult?: boolean;
  averageRatingFrom?: number;
  averageRatingTo?: number;
  numVotesFrom?: number;
  numVotesTo?: number;
  rows?: number;
  startYearFrom?: number;
  startYearTo?: number;
  countriesOfOrigin?: string;
  spokenLanguages?: string;
  sortOrder?: ImdbSortOrder;
  sortField?: ImdbSortField;
  cursorMark?: string;
}
