import { Component, inject, OnInit } from '@angular/core';
import { PurchaseService } from '../../services/purchase.service';
import { ToastService } from '../../../_shared/services/toast.service';
import { IGetPurchases } from '../../interfaces/IGetPurchases';

@Component({
  selector: 'app-get-purchases-page',
  standalone: true,
  imports: [],
  providers: [PurchaseService],
  templateUrl: './get-purchases-page.component.html',
  styleUrl: './get-purchases-page.component.css'
})
export class GetPurchasesPageComponent implements OnInit{
  purchaseService: PurchaseService = inject(PurchaseService);
  toastService: ToastService = inject(ToastService);
  purchases: IGetPurchases[] = [];
  iQueryParams = {
    isDescendingDate: null,
    userName: '',
    page: 1,
    pageSize: 10
  };
  errors: string[] = []

  ngOnInit(){
  }
}