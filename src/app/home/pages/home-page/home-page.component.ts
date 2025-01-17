import { Component, inject, Input, OnInit } from '@angular/core';
import { SideBarComponent } from "../../components/side-bar/side-bar.component";
import { ProductCardComponent } from "../../components/product-card/product-card.component";
import { HttpClientModule } from '@angular/common/http';
import { ProductServiceService } from '../../services/product-service.service';
import { Product } from '../../interfaces/product';
import { CommonModule } from '@angular/common';
import { PaginationComponent } from "../../components/pagination/pagination.component";
import { QueryParams } from '../../interfaces/queryParams';
import { QueryServiceService } from '../../services/query-service.service';
import { Subscription } from 'rxjs';
import { CartServiceService } from '../../../cart/services/cart-service.service';
import { NavBarComponent } from '../../../_shared/components/nav-bar/nav-bar.component';
import { LogInComponent } from "../../../auth/components/log-in/log-in.component";
import { SignUpComponent } from "../../../auth/components/sign-up/sign-up.component";
import { ToastService } from '../../../_shared/services/toast.service';

/**
 * Componente de la página principal de la aplicación
 */
@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [SideBarComponent, ProductCardComponent, HttpClientModule, CommonModule, PaginationComponent, NavBarComponent, LogInComponent, SignUpComponent],
  providers: [ProductServiceService, CartServiceService],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent {

  /**
   * Lista de productos a mostrar en la página principal
   */
  public productsList: Product[] = [];
  /**
   * Servicio de productos
   */
  private productService: ProductServiceService = inject(ProductServiceService);
  /**
   * Servicio de carrito
   */
  private cartService: CartServiceService = inject(CartServiceService);
  /**
   * Servicio de filtros
   */
  private queryService: QueryServiceService = inject(QueryServiceService);
  /**
   * Servicio de notificaciones
   */
  private toastService: ToastService = inject(ToastService);
  /**
   * Suscripción a los filtros
   */
  private filterSubscription!: Subscription;
  /**
   * Producto seleccionado
   */
  public product!: Product;
  /**
   * Indica si el formulario de inicio de sesión está abierto
   */
  public logInFormIsOpen = false;
  /**
   * Indica si el formulario de registro está abierto
   */
  public signUpFormIsOpen = false;

  /**
   * Función que se ejecuta al iniciar el componente
   */
  ngOnInit(): void {
    this.filterSubscription = this.queryService.currentFilters$.subscribe((filters) => {
      this.getProducts(filters);
    });
  }

  /**
   * Función que se ejecuta al destruir el componente
   */
  ngOnDestroy(): void {
    this.filterSubscription?.unsubscribe();
  }

  /**
   * Método que recibe si el formulario de inicio de sesión está abierto
   * @param logInFormIsOpen Objeto que indica si el formulario de inicio de sesión está abierto
   */
  reciveLogInFormIsOpen(logInFormIsOpen: boolean): void {
    this.logInFormIsOpen = logInFormIsOpen;
  }

  /**
   * Método que recibe si el formulario de registro está abierto
   * @param signUpFormIsOpen Objeto que indica si el formulario de registro está abierto
   */
  reciveSignUpFormIsOpen(signUpFormIsOpen: boolean): void {
    this.signUpFormIsOpen = signUpFormIsOpen;
  }

  /**
   * Método que recibe el producto seleccionado
   * @param product Objeto que representa el producto seleccionado
   */
  reciveIdProductForCart(product: Product): void {
    this.product = product;

    if (this.product) 
    {
      this.addProductToCart(this.product.id);
      console.log('Producto seleccionado: ', this.product);
    } else 
    {
      console.log('No se ha seleccionado un producto');
    }
  }

  /**
   * Método que obtiene los productos
   * @param filter: QueryParams Objeto que contiene los filtros de búsqueda
   */
  getProducts(filter: QueryParams): void {
    try {
      this.productsList = [];
      this.productService.getAll(filter).then((products) => {
        console.log(products);
        for (let i = 0; i < products.length; i++) {
          this.productsList.push(products[i]);
        }
        if (this.productsList.length === 0){
          this.toastService.warning('No se encontraron productos', 2000);
        }
      }).catch((error) => {
        console.log(error);
      });
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * Método que añade un producto al carrito
   * @param productId Numero que representa el identificador del producto
   */
  addProductToCart(productId: number): void {
    this.cartService.addProductToCart(productId, 1).subscribe({
      next: (cart) => {
        console.log(cart);
      },
      error: (error) => {
        console.log(error);
      }
    });
  }
}
