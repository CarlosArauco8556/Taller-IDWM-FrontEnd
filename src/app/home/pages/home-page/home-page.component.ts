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

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [SideBarComponent, ProductCardComponent, HttpClientModule, CommonModule, PaginationComponent, NavBarComponent],
  providers: [ProductServiceService, CartServiceService],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent {

  public productsList: Product[] = [];
  private productService: ProductServiceService = inject(ProductServiceService);
  private cartService: CartServiceService = inject(CartServiceService);
  private queryService: QueryServiceService = inject(QueryServiceService);
  private filterSubscription!: Subscription;

  public product!: Product;

  ngOnInit(): void {
    this.filterSubscription = this.queryService.currentFilters$.subscribe((filters) => {
      this.getProducts(filters);
    });
  }

  ngOnDestroy(): void {
    this.filterSubscription?.unsubscribe();
  }

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

  getProducts(filter: QueryParams): void {
    try {
      this.productsList = [];
      this.productService.getAll(filter).then((products) => {
        console.log(products);
        for (let i = 0; i < products.length; i++) {
          this.productsList.push(products[i]);
        }
      }).catch((error) => {
        console.log(error);
      });
    } catch (error) {
      console.log(error);
    }
  }

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
