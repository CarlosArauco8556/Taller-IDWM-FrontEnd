import { Routes } from '@angular/router';
import { authGuardGuard } from './_shared/guards/auth-guard.guard';

/// <summary>
/// Rutas de la aplicación
/// </summary>
export const routes: Routes = [
    /// <summary>
    /// Ruta para cambiar la contraseña
    /// </summary>
    {
        path: 'change-password',
        pathMatch: 'full',
        loadComponent: () => import('./users/pages/change-password-page/change-password-page.component')
            .then(m => m.ChangePasswordPageComponent),
        canActivate: [authGuardGuard],
        data: { roles: ['ADMIN', 'USER'] }
    },
    /// <summary>
    /// Ruta para editar el perfil
    /// </summary>
    {
        path: 'edit-profile',
        pathMatch: 'full',
        loadComponent: () => import('./users/pages/edit-profile-page/edit-profile-page.component')
            .then(m => m.EditProfilePageComponent),
        canActivate: [authGuardGuard],
        data: { roles: ['ADMIN', 'USER'] }
    },
    /// <summary>
    /// Ruta para el carrito de compras
    /// </summary>
    {
        path: 'cart',
        loadComponent: () => import('./cart/pages/shopping-cart/shopping-cart.component')
            .then(m => m.ShoppingCartComponent)
    },
    /// <summary>
    /// Ruta para el home inicial
    /// </summary>
    {
        path: 'home',
        pathMatch: 'full',
        loadComponent: () => import('./home/pages/home-page/home-page.component')
            .then(m => m.HomePageComponent)
    },
    /// <summary>
    /// Ruta para home del administrador
    /// </summary>
    {
        path: 'home-admin',
        pathMatch: 'full',
        loadComponent: () => import('./admin/pages/home-admin-page/home-admin-page.component')
            .then(m => m.HomeAdminPageComponent),
        canActivate: [authGuardGuard],
        data: { roles: ['ADMIN'] }
    },
    /// <summary>
    /// Ruta para agregar productos
    /// </summary>
    {
        path: 'add-products',
        pathMatch: 'full',
        loadComponent: () => import('./products/pages/add-products-page/add-products-page.component').then(m => m.AddProductsPageComponent),
        canActivate: [authGuardGuard],
        data: { roles: ['ADMIN'] }
    },
    /// <summary>
    /// Ruta para editar productos
    /// </summary>
    {
        path: 'edit-product/:id',
        pathMatch: 'full',
        loadComponent: () => import('./products/pages/edit-products-page/edit-products-page.component').then(m => m.EditProductsPageComponent),
        canActivate: [authGuardGuard],
        data: { roles: ['ADMIN'] }
    },
    /// <summary>
    /// Ruta para la gestión de productos
    /// </summary>
    {
        path: 'management-products',
        pathMatch: 'full',
        loadComponent: () => import('./products/pages/management-products-page/management-products-page.component').then(m => m.ManagementProductsPageComponent),
        canActivate: [authGuardGuard],
        data: { roles: ['ADMIN'] }
    },
    /// <summary>
    /// Ruta para realizar una compra
    /// </summary>
    {
        path: 'create-purchase',
        pathMatch: 'full',
        loadComponent: () => import('./purchaseUser/pages/create-purchase/create-purchase.component').then(m => m.CreatePurchaseComponent),
        canActivate: [authGuardGuard],
        data: { roles: ['USER'] }
    },
    /// <summary>
    /// Si no se encuentra la ruta se redirige al home
    /// </summary>
    {    
        path: '',
        pathMatch: 'full',
        loadComponent: () => import('./home/pages/home-page/home-page.component')
            .then(m => m.HomePageComponent)
    },
    /// <summary>
    /// Si no se encuentra la ruta se redirige al home
    /// </summary>
    {
        path: '**',
        redirectTo: 'home'
    }
];