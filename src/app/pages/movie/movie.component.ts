import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { MovieModel } from 'src/app/models/movie.model';
import { MoviesService } from 'src/app/services/movies.service';

import Swal from 'sweetalert2';
import { Observable } from 'rxjs';
import { MoviesApiService } from 'src/app/services/movies-api.service';

@Component({
  selector: 'app-movie',
  templateUrl: './movie.component.html',
})
export class MovieComponent implements OnInit {

  movieSearch: {
    img: string
    title: string
  } = {
    img: '',
    title: 'string'
  }

  movie: MovieModel = new MovieModel();
  numbers: number[] = [];

  loading: boolean = false;
  loadingImage: boolean = false;

  constructor(
    private moviesService: MoviesService,
    private router: Router,
    private route: ActivatedRoute,
    private moviesApi: MoviesApiService
  ) {
    for (let i = 1; i <= 10; i++) {
      this.numbers.push(i);
    }
  }

  ngOnInit(): void {
    this.loading = true;
    const id = this.route.snapshot.paramMap.get('id');
    if (id !== 'new' && id !== null) {
      this.moviesService.getMovie(id).subscribe((res: any) => {
        this.movie = res;
        this.movie.id = id;
        if (this.movie.img) this.movieSearch.img = this.movie.img
        this.loading = false;
      });
    } else {
      this.loading = false;
    }
  }

  search(key: string):void {
    this.loadingImage = true;
    this.moviesApi.getMovie(key).subscribe(res=>{
      if (res) {
        this.movieSearch.img = 'https://image.tmdb.org/t/p/w500' + res.poster_path;
        this.movieSearch.title = res.title
      } else {
        this.movieSearch.img = '';
        this.movieSearch.title = '';
      }
      this.loadingImage= false;
    })
  }

  save(form: NgForm): void {
    if (form.controls["rating"].value === 0) {
      form.controls["rating"].setErrors({
        notZero: true
      })
    } else {
      form.controls["rating"].setErrors(null)
    }
    const id = this.route.snapshot.paramMap.get('id');
    if (form.invalid) {
      return Object.values(form.controls).forEach(control => {
        control.markAsTouched();
      })
    }

    Swal.fire({
      title: 'Espere',
      text: 'Guardando información',
      icon: 'info',
      allowOutsideClick: false,
    });
    Swal.showLoading();

    let req: Observable<any>;

    if (this.movie.id) {
      req = this.moviesService.updateMovie({...this.movie, img: this.movieSearch.img});
    } else {
      req = this.moviesService.createMovie({...this.movie, img: this.movieSearch.img});
    }

    req.subscribe((res) => {
      Swal.fire({
        title: this.movie.name,
        text: `Se ${id!=='new' ? 'actualizó' : 'agregó'} correctamente`,
        icon: 'success',
      }).then(()=> this.router.navigateByUrl('/movies'))
    });
  }
}
