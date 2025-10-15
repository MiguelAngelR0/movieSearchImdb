import { Routes } from '@angular/router';

export const routes: Routes = [

  {
    path: '',
    loadComponent: () => import('./movies/pages/landing/landing'),
  },
  {
    path: '**',
    redirectTo: ''
  }

];
