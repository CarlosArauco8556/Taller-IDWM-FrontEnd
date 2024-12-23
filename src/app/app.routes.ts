import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'change-password',
        pathMatch: 'full',
        loadComponent: () => import('./users/pages/change-password-page/change-password-page.component').then(m => m.ChangePasswordPageComponent)
    },
    {
        path: 'change-state',
        pathMatch: 'full',
        loadComponent: () => import('./users/pages/change-state-page/change-state-page.component').then(m => m.ChangeStatePageComponent)
    },
    {
        path: 'edit-profile',
        pathMatch: 'full',
        loadComponent: () => import('./users/pages/edit-profile-page/edit-profile-page.component').then(m => m.EditProfilePageComponent)
    },
    {
        path: 'get-users',
        pathMatch: 'full',
        loadComponent: () => import('./users/pages/get-users-page/get-users-page.component').then(m => m.GetUsersPageComponent)
    },
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
