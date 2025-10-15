import { Component, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop'
import { catchError, of, tap } from 'rxjs';

import { Imdb } from '../../services/imdb';
import { Pagination } from "../../components/pagination/pagination";
import { SortButtons } from "../../components/sort-buttons/sort-buttons";
import { Loading } from "../../components/loading/loading";
import { SearchForm } from "../../components/search-form/search-form";
import { MovieList } from "../../components/movie-list/movie-list";
import { Error } from "../../components/error/error";

import { ImdbSearchParams, ImdbSortField, ImdbSortOrder } from '../../interfaces/imdbSearchParams';
import { ImdbSearchResponse } from '../../interfaces/imdbResponse';

import { ButtonModule } from 'primeng/button';



@Component({
  selector: 'app-landing',
  imports: [MovieList, SearchForm, SortButtons, ButtonModule, Pagination, Loading, Error],
  templateUrl: './landing.html',
  styles: `

  .wrapper {
    position: relative;
    width: 100%;
    height: 100%;
    padding: 20px;
    display: flex;
    align-content: center;
    justify-content: center;
    gap: 24px;
    flex-wrap: wrap;
}

  `
})

export default class Landing {
  imdb = inject(Imdb);

  cursorHistory = signal<string[]>(['*']);

  lastRequestedCursor = signal<string | null>(null);
  isLoadingNextPage = signal(false);
  isLastPage = signal(false);

  searchParams = signal<ImdbSearchParams>({
    rows: 12,
    sortField: 'averageRating',
    sortOrder: 'ASC',
    type: 'movie'
  });

  movieResource = rxResource({
    params: () => this.searchParams(),
    stream: ({ params }) => {
      if (!params?.rows) {
        return of({ results: [], numFound: 0 } as ImdbSearchResponse);
      }

      this.isLoadingNextPage.set(true);

      return this.imdb.searchMovies(params).pipe(
        tap((resp: ImdbSearchResponse) => {

          this.isLoadingNextPage.set(false);

          const reqCursor = this.lastRequestedCursor();

          const noResults = !resp.results?.length;

          const nextCursor = resp.nextCursorMark;
          const currentHistory = this.cursorHistory();



          if (reqCursor && !currentHistory.includes(reqCursor)) {

            if (!noResults || (nextCursor && nextCursor !== reqCursor)) {
              this.cursorHistory.update(h => [...h, reqCursor]);
            }
          }

          if (!nextCursor || noResults || (reqCursor && nextCursor === reqCursor)) {
            this.isLastPage.set(true);
          } else {
            this.isLastPage.set(false);
          }


          this.lastRequestedCursor.set(null);
        }),
        catchError((error) => {
          this.isLoadingNextPage.set(false);
          throw error;
        })
      );
    }
  });

  onSearch(params: ImdbSearchParams) {
    this.searchParams.update(
      p => ({ ...p, ...params, cursorMark: undefined })
    );
    this.cursorHistory.set(['*']);
  }

  onSortChange(event: { sortField: ImdbSortField; sortOrder: ImdbSortOrder }) {
    this.searchParams.update(p => ({
      ...p,
      sortField: event.sortField,
      sortOrder: event.sortOrder,
      cursorMark: undefined
    }));
    this.cursorHistory.set(['*']);
  }



  loadNextPage() {
    const response = this.movieResource.value();
    const nextCursor = response?.nextCursorMark;
    if (!nextCursor) {
      this.isLastPage.set(true);
      return;
    }

    if (this.lastRequestedCursor() === nextCursor) return;

    this.lastRequestedCursor.set(nextCursor);

    this.searchParams.update(p => ({ ...p, cursorMark: nextCursor }));

    this.isLoadingNextPage.set(true);
  }


  goToPage(pageNumber: number) {
    const history = this.cursorHistory();
    const cursor = history[pageNumber - 1];
    if (!cursor) return;

    this.searchParams.update(p => ({
      ...p,
      cursorMark: cursor === '*' ? undefined : cursor
    }));
    this.isLastPage.set(false);
  }

  hasNextPage(): boolean {
    return !this.isLastPage() && !this.isLoadingNextPage();
  }
}
