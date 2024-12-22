import { Component, inject, OnInit } from '@angular/core';
import { SideBarComponent } from "../../components/side-bar/side-bar.component";
import { RouterOutlet } from '@angular/router';
import { ProductCardComponent } from "../../components/product-card/product-card.component";
import { HttpClientModule } from '@angular/common/http';
import { ProductServiceService } from '../../services/product-service.service';
import { Product } from '../../interfaces/product';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [SideBarComponent, ProductCardComponent, HttpClientModule, CommonModule],
  providers: [ProductServiceService],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent {

  public productsList: Product[] = [];
  private productService: ProductServiceService = inject(ProductServiceService); 

  ngOnInit(): void {
    this.getProducts();
  }

  getProducts() {
    try
    {
      this.productService.getAll().then((products) => {
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
