import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from './../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MoviesApiService {
  constructor(private http: HttpClient) {}

  getMovie(key: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization:
        'Bearer '+environment.apiMoviesToken,
    });
    return this.http
      .get(
        `https://api.themoviedb.org/3/search/movie?api_key=${environment.apiMoviesKey}&language=es-ES&page=1&include_adult=false&query=${key}`,
        { headers }
      )
      .pipe(map((res: any) => res.results[0]));
  }
}
