import { Component, input } from '@angular/core';
import { ImdbMovie } from '../../../interfaces/imdbResponse';
import { SlicePipe } from '@angular/common';
import { Skeleton } from 'primeng/skeleton';

@Component({
  selector: 'app-movie-card',
  imports: [SlicePipe, Skeleton],
  templateUrl: './movie-card.html',
  styleUrl: './movie-card.css'
})
export class MovieCard {

  movie = input.required<ImdbMovie | undefined>();


}
