import { Component, input } from '@angular/core';
import { ImdbMovie } from '../../interfaces/imdbResponse';
import { MovieCard } from "./movie-card/movie-card";

@Component({
  selector: 'app-movie-list',
  imports: [MovieCard],
  templateUrl: './movie-list.html',
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
export class MovieList {

  movies = input<ImdbMovie[]>();



}
