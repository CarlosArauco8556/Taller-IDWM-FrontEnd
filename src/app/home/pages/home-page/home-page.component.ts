import { Component, inject, OnInit } from '@angular/core';
import { SideBarComponent } from "../../components/side-bar/side-bar.component";
import { ProductCardComponent } from "../../components/product-card/product-card.component";
import { HttpClientModule } from '@angular/common/http';
import { ProductServiceService } from '../../services/product-service.service';
import { Product } from '../../interfaces/product';
import { CommonModule } from '@angular/common';
import { PaginationComponent } from "../../components/pagination/pagination.component";
import { QueryParams } from '../../interfaces/queryParams';
import { QueryServiceService } from '../../services/query-service.service';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [SideBarComponent, ProductCardComponent, HttpClientModule, CommonModule, PaginationComponent],
  providers: [ProductServiceService],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent {

  public productsList: Product[] = [];
  private productService: ProductServiceService = inject(ProductServiceService);
  private queryService: QueryServiceService = inject(QueryServiceService);
  public queryParamsI: QueryParams = {textFilter: "", sortByPrice: undefined, IsDescending: undefined, pageNumber: 1, pageSize: 10};

  ngOnInit(): void {
    this.queryService.textFilter$.subscribe((textFilter) => {
      this.queryParamsI.textFilter = textFilter;
      this.queryParamsI.pageNumber = 1; 
      this.getProducts(); 
    });
  }

  getProducts() {
    try
    {
      this.productsList = [];
      this.productService.getAll(this.queryParamsI).then((products) => {
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
