import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'change-password',
        pathMatch: 'full',
        loadComponent: () => import('./users/pages/change-password-page/change-password-page.component').then(m => m.ChangePasswordPageComponent)
    },
    {
        path: 'management-users',
        pathMatch: 'full',
        loadComponent: () => import('./users/pages/management-users-page/management-users-page.component').then(m => m.ManagementUsersPageComponent)
    },
    {
        path: 'edit-profile',
        pathMatch: 'full',
        loadComponent: () => import('./users/pages/edit-profile-page/edit-profile-page.component').then(m => m.EditProfilePageComponent)
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
