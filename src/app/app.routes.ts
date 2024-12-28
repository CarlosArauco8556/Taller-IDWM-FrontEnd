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
    path: '**',
    redirectTo: 'home'
},

];
