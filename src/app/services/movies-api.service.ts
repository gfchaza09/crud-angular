import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from './../../environments/environment';
import { Movie, MoviesResponse } from '../models/movies-response';

@Injectable({
  providedIn: 'root',
})
export class MoviesApiService {
  constructor(private http: HttpClient) {}

  getMovie(key: string): Observable<Movie> {
    const headers = new HttpHeaders({
      Authorization:
        'Bearer '+environment.apiMoviesToken,
    });
    return this.http
      .get<MoviesResponse>(
        `https://api.themoviedb.org/3/search/movie?api_key=${environment.apiMoviesKey}&language=es-ES&page=1&include_adult=false&query=${key}`,
        { headers }
      )
      .pipe(map((res) => res.results[0]));
  }
}
