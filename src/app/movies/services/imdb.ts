import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environments.development';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';


import { ImdbSearchParams } from '../interfaces/imdbSearchParams';
import { ImdbSearchResponse } from '../interfaces/imdbResponse';

@Injectable({
  providedIn: 'root'
})
export class Imdb {
  private apiUrl = environment.imdbApiUrl;

  private http = inject(HttpClient);
  searchMovies(params: ImdbSearchParams): Observable<ImdbSearchResponse> {
    const headers = new HttpHeaders({
      'x-rapidapi-host': environment.rapidApiHost,
      'x-rapidapi-key': environment.rapidApiKey,
    });

    let httpParams = new HttpParams();

    if (params.primaryTitle)
      httpParams = httpParams.set('primaryTitle', params.primaryTitle);

    if (params.genre)
      httpParams = httpParams.set('genre', params.genre);

    if (params.genres)
      params.genres.forEach(g => httpParams = httpParams.append('genres[]', g));

    if (params.averageRatingFrom)
      httpParams = httpParams.set('averageRatingFrom', params.averageRatingFrom.toString());

    if (params.averageRatingTo)
      httpParams = httpParams.set('averageRatingTo', params.averageRatingTo.toString());

    if (params.rows)
      httpParams = httpParams.set('rows', params.rows.toString());

    if (params.startYearFrom)
      httpParams = httpParams.set('startYearFrom', params.startYearFrom.toString());

    if (params.startYearTo)
      httpParams = httpParams.set('startYearTo', params.startYearTo.toString());


    if (params.sortField)
      httpParams = httpParams.set('sortField', params.sortField);

    if (params.sortOrder)
      httpParams = httpParams.set('sortOrder', params.sortOrder);

    if (params.cursorMark)
      httpParams = httpParams.set('cursorMark', params.cursorMark);

    return this.http.get<ImdbSearchResponse>(`${this.apiUrl}/search`, {
      headers,
      params: httpParams,
    });
  }
}
