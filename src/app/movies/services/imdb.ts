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
      'x-rapidapi-key': environment.rapidApiKey
    });

    let httpParams = new HttpParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value != null) { // Filtra null y undefined
        if (Array.isArray(value)) {
          value.forEach(v => httpParams = httpParams.append(`${key}[]`, v));
        } else {
          httpParams = httpParams.set(key, value.toString());
        }
      }
    });

    return this.http.get<ImdbSearchResponse>(`${this.apiUrl}/search`, {
      headers,
      params: httpParams
    });
  }
}
