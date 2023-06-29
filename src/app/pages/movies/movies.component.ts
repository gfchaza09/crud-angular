import { Component, OnInit } from '@angular/core';
import { MovieModel } from 'src/app/models/movie.model';
import { MoviesService } from 'src/app/services/movies.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-movies',
  templateUrl: './movies.component.html'
})
export class MoviesComponent implements OnInit {
  
  movies: MovieModel[] = [];
  loading: boolean = false;
  
  constructor( private moviesService: MoviesService) {}

  ngOnInit(): void {
    this.loading = true;
    this.moviesService.getMovies().subscribe(res=> {
      this.movies = res
      this.loading = false;
    })
  }

  deleteMovie(movie:MovieModel, i: number):void {

    Swal.fire({
        title: '¿Está seguro que desea borrar la película?',
        text: `Va a borrar la película: ${movie.name}`,
        icon: 'question',
        showConfirmButton: true,
        showCancelButton: true,
        cancelButtonText: 'Cancelar'
    }).then((res) => {
      if (res.value) {
        this.movies.splice(i,1);
    
        if (movie.id) this.moviesService.deleteMovie(movie.id).subscribe()
      }
    })

  }
}
