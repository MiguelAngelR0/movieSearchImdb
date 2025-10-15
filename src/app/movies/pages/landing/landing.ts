import { Component, inject, signal, WritableSignal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop'

import { ImdbSearchParams, ImdbSortField, ImdbSortOrder } from '../../interfaces/imdbSearchParams';
import { Imdb } from '../../services/imdb';
import { catchError, of } from 'rxjs';
import { ImdbSearchResponse } from '../../interfaces/imdbResponse';
import { MovieList } from "../../components/movie-list/movie-list";
import { SearchForm } from "../../components/search-form/search-form";
import { SortButtons } from "../../components/sort-buttons/sort-buttons";
import { ProgressSpinner } from 'primeng/progressspinner';
import { ButtonModule } from 'primeng/button';


@Component({
  selector: 'app-landing',
  imports: [MovieList, SearchForm, SortButtons, ProgressSpinner, ButtonModule],
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

  /** Historial de cursores por página */
  cursorHistory = signal<string[]>(['*']);

  /** Parámetros actuales de búsqueda */
  searchParams = signal<ImdbSearchParams>({
    rows: 12,
    sortField: 'averageRating',
    sortOrder: 'ASC'
  });

  /** Recurso reactivo de películas */
  movieResource = rxResource({
    params: () => this.searchParams(),
    stream: ({ params }) => {
      if (!params?.rows) {
        return of({ results: [], numFound: 0 } as ImdbSearchResponse);
      }

      return this.imdb.searchMovies(params).pipe(
        catchError((error) => {
          const msg = error.error?.message || error.message || 'Error al cargar películas';
          throw new Error(msg);
        })
      );
    }
  });

  /** Cambiar ordenación */
  onSortChange(event: { sortField: ImdbSortField; sortOrder: ImdbSortOrder }) {
    this.searchParams.update(p => ({
      ...p,
      sortField: event.sortField,
      sortOrder: event.sortOrder,
      cursorMark: undefined
    }));
    this.cursorHistory.set(['*']);
  }

  /** Cargar siguiente página y guardar el cursor */
  loadNextPage() {
    const response = this.movieResource.value();
    const nextCursor = response?.nextCursorMark;
    if (!nextCursor) return;

    this.cursorHistory.update(h => [...h, nextCursor]);
    this.searchParams.update(p => ({ ...p, cursorMark: nextCursor }));
  }

  /** Ir a una página ya cargada */
  goToPage(pageNumber: number) {
    const history = this.cursorHistory();
    const cursor = history[pageNumber - 1];
    if (!cursor) return;

    this.searchParams.update(p => ({
      ...p,
      cursorMark: cursor === '*' ? undefined : cursor
    }));
  }

  /** Nueva búsqueda desde formulario */
  onSearch(params: ImdbSearchParams) {
    this.searchParams.update(p => ({
      ...p,
      ...params,
      cursorMark: undefined
    }));
    this.cursorHistory.set(['*']);
  }

  hasNextPage(): boolean {
    return !!this.movieResource.value()?.nextCursorMark;
  }
}
