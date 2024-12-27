import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'change-password',
        pathMatch: 'full',
        loadComponent: () => import('./users/pages/change-password-page/change-password-page.component').then(m => m.ChangePasswordPageComponent)
    },
    {
        path: 'edit-profile',
        pathMatch: 'full',
        loadComponent: () => import('./users/pages/edit-profile-page/edit-profile-page.component').then(m => m.EditProfilePageComponent)
    },
    {
        path: 'cart',
        loadComponent: () => import('./cart/pages/shopping-cart/shopping-cart.component').then(m => m.ShoppingCartComponent)
    },
    {
        path: 'home',
        pathMatch: 'full',
        loadComponent: () => import('./home/pages/home-page/home-page.component').then(m => m.HomePageComponent)
    },
    {
        path: 'home-admin',
        pathMatch: 'full',
        loadComponent: () => import('./admin/pages/home-admin-page/home-admin-page.component').then(m => m.HomeAdminPageComponent)
    },
    {    
        path: '',
        pathMatch: 'full',
        loadComponent: () => import('./home/pages/home-page/home-page.component').then(m => m.HomePageComponent),
    },
    {
        path: '**',
        redirectTo: 'home'
    }
];
