export interface ImdbMovie {
  id: string;
  primaryTitle: string;
  originalTitle?: string;
  startYear?: number;
  genres?: string[];
  averageRating?: number;
  numVotes?: number;
  isAdult?: boolean;
  primaryImage?: string;
  contentRating?: string;
  description?: string;
  runtimeMinutes?: number;
  countriesOfOrigin?: string[];
  spokenLanguages?: string[];
}

export interface ImdbSearchResponse {
  numFound?: number;
  rows?: number;
  results: ImdbMovie[];
  nextCursorMark?: string;
}
