import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        loadComponent: () => import('./home/pages/home-page/home-page.component').then(m => m.HomePageComponent),
    },
    {
        path: 'home',
        pathMatch: 'full',
        loadComponent: () => import('./home/pages/home-page/home-page.component').then(m => m.HomePageComponent)
    },
    {
        path: 'cart',
        loadComponent: () => import('./cart/pages/shopping-cart/shopping-cart.component').then(m => m.ShoppingCartComponent)
    },
    {
        path: '**',
        redirectTo: 'home'
    }
];
