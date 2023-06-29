import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MovieModel } from '../models/movie.model';
import { map } from 'rxjs/operators';
import { environment } from './../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MoviesService {

  private url = environment.firebaseUrl;

  constructor(private http: HttpClient) {}

  getMovies(): Observable<MovieModel[]>{
    return this.http.get<Record<string, MovieModel> | null>(`${this.url}/movies.json`)
    // Cuando entra al map se ejecuta la funcion createArrMovie 
    // y toma como argumento el primer argumento que retorna map, es decir, la respuesta
      .pipe(map( this.createArrMovie ))
  }

  private createArrMovie(moviesObj: Record<string, MovieModel> | null): MovieModel[] {
    const movies: MovieModel[] = [];
    if (moviesObj === null) return [];
    Object.keys(moviesObj).forEach( (key: string) => {
      const movie: MovieModel = moviesObj[key];
      movie.id = key;
      movies.push( movie);
    });

    return movies;
  }

  getMovie(id: string): Observable<MovieModel> {
    return this.http.get<MovieModel>(`${this.url}/movies/${id}.json`);
  }

  createMovie( movie: MovieModel): Observable<MovieModel> {
    return this.http.post(`${this.url}/movies.json`, movie)
      .pipe(map( (res: any) => {
        movie.id = res.name;
        return movie;
      }));
  }

  updateMovie(movie: MovieModel): Observable<any>{

    const movieTemp:Partial<MovieModel> = {
      ...movie
    };

    delete movieTemp.id;

    return this.http.put(`${this.url}/movies/${movie.id}.json`, movieTemp)
  }

  deleteMovie(id: string): Observable<any> {
    return this.http.delete(`${this.url}/movies/${id}.json`)
  }

}
