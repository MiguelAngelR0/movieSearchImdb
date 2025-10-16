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

  //Historial de cursores ya usados
  cursorHistory = signal<string[]>(['*']);
  //Guarda el último cursor que se solicitó para evitar duplicar peticiones.
  lastRequestedCursor = signal<string | null>(null);
  //Indica si se está cargando la siguiente página
  isLoadingNextPage = signal(false);
  //Indica si se ha llegado a la última página
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

        tap(resp => {
          this.isLoadingNextPage.set(false);
          this.updateCursorState(resp);
        }),
        catchError((error) => {
          this.isLoadingNextPage.set(false);
          throw error;
        })
      );
    }
  });

  private updateCursorState(resp: ImdbSearchResponse) {
    const req = this.lastRequestedCursor();
    const next = resp.nextCursorMark ?? null;
    const hasResults = !!resp.results?.length;
    // Si el cursor de la respuesta es diferente al solicitado y hay resultados, se añade al historial.
    if (req && !this.cursorHistory().includes(req) && hasResults && next !== req) {
      //Crea una copia del array agregando req al final.
      this.cursorHistory.update(h => [...h, req]);
    }
    // Determina si se ha llegado al final de los resultados.
    const reachedEnd = !hasResults || !next || next === req;
    this.isLastPage.set(reachedEnd);
    //
    this.lastRequestedCursor.set(null);
  }

  // Inicia una nueva búsqueda con los parámetros indicados, reseteando el cursor y el historial de cursores.
  onSearch(params: ImdbSearchParams) {
    this.searchParams.update(
      p => ({ ...p, ...params, cursorMark: undefined })
    );
    this.cursorHistory.set(['*']);
  }

  // Cambia el orden de los resultados y resetea el cursor y el historial de cursores.
  onSortChange(event: { sortField: ImdbSortField; sortOrder: ImdbSortOrder }) {
    this.searchParams.update(p => ({
      ...p,
      sortField: event.sortField,
      sortOrder: event.sortOrder,
      cursorMark: undefined
    }));
    this.cursorHistory.set(['*']);
  }


  // Carga la siguiente página de resultados si existe.
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

  // Navega a una página específica basada en el historial de cursores.
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
