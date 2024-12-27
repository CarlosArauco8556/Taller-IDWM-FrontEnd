import { Component, inject } from '@angular/core';
import { ProductManagementService } from '../../services/product-management.service';
import { IProduct } from '../../interfaces/IProduct';
import { QueryProductService } from '../../services/query-service.service';
import { Subscription } from 'rxjs';
import { IQueryParams } from '../../interfaces/IQueryParams';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { PaginationComponent } from '../../components/pagination/pagination.component';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { AddButtonComponent } from '../../components/add-button/add-button.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-management-products-page',
  standalone: true,
  imports: [HttpClientModule, CommonModule, PaginationComponent, ProductCardComponent, AddButtonComponent],
  providers: [ProductManagementService],
  templateUrl: './management-products-page.component.html',
  styleUrl: './management-products-page.component.css'
})
export class ManagementProductsPageComponent {

  public productsList: IProduct[] = [];
  private productManagementService: ProductManagementService = inject(ProductManagementService);
  private queryService: QueryProductService = inject(QueryProductService);
  private filterSubscription!: Subscription;
  constructor(private router: Router) { }

  addProduct() {
    this.router.navigate(['/add-products']);
  }
  

  ngOnInit(): void {
    this.filterSubscription = this.queryService.currentFilters$.subscribe((filters) => {
      this.getProducts(filters);
    });
  }

  ngOnDestroy(): void {
    this.filterSubscription?.unsubscribe();
  }

  getProducts(filter: IQueryParams): void {
    try
    {
      this.productsList = [];
      this.productManagementService.getProducts(filter).then((products) => {
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

}
