import { Routes } from '@angular/router';
import { authGuardGuard } from './_shared/guards/auth-guard.guard';

export const routes: Routes = [
    {
        path: 'change-password',
        pathMatch: 'full',
        loadComponent: () => import('./users/pages/change-password-page/change-password-page.component')
            .then(m => m.ChangePasswordPageComponent),
        canActivate: [authGuardGuard],
        data: { roles: ['ADMIN', 'USER'] }
    },
    {
        path: 'edit-profile',
        pathMatch: 'full',
        loadComponent: () => import('./users/pages/edit-profile-page/edit-profile-page.component')
            .then(m => m.EditProfilePageComponent),
        canActivate: [authGuardGuard],
        data: { roles: ['ADMIN', 'USER'] }
    },
    {
        path: 'cart',
        loadComponent: () => import('./cart/pages/shopping-cart/shopping-cart.component')
            .then(m => m.ShoppingCartComponent)
    },
    {
        path: 'home',
        pathMatch: 'full',
        loadComponent: () => import('./home/pages/home-page/home-page.component')
            .then(m => m.HomePageComponent)
    },
    {
        path: 'home-admin',
        pathMatch: 'full',
        loadComponent: () => import('./admin/pages/home-admin-page/home-admin-page.component')
            .then(m => m.HomeAdminPageComponent),
        canActivate: [authGuardGuard],
        data: { roles: ['ADMIN'] }
    },
    {
        path: 'add-products',
        pathMatch: 'full',
        loadComponent: () => import('./products/pages/add-products-page/add-products-page.component').then(m => m.AddProductsPageComponent),
    },
    {
        path: 'edit-product/:id',
        pathMatch: 'full',
        loadComponent: () => import('./products/pages/edit-products-page/edit-products-page.component').then(m => m.EditProductsPageComponent),
    },
    {
        path: 'management-products',
        pathMatch: 'full',
        loadComponent: () => import('./products/pages/management-products-page/management-products-page.component').then(m => m.ManagementProductsPageComponent),
    },
    {
        path: 'create-purchase',
        pathMatch: 'full',
        loadComponent: () => import('./purchaseUser/pages/create-purchase/create-purchase.component').then(m => m.CreatePurchaseComponent),
    },
    {    
        path: '',
        pathMatch: 'full',
        loadComponent: () => import('./home/pages/home-page/home-page.component')
            .then(m => m.HomePageComponent)
    },
    {
        path: '**',
        redirectTo: 'home'
    }
];