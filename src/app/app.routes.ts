import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'home',
        pathMatch: 'full',
        loadComponent: () => import('./home/pages/home-page/home-page.component').then(m => m.HomePageComponent)
    },
    {
        path: '**',
        redirectTo: 'home'
    }
];
