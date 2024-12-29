import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { IQueryParams } from '../interfaces/IQueryParams';
import { firstValueFrom } from 'rxjs';
import { IGetPurchases } from '../interfaces/IGetPurchases';
import { LocalStorageServiceService } from '../../_shared/services/local-storage-service.service';

@Injectable({
  providedIn: 'root'
})
export class PurchaseService {
  localStorageServiceService: LocalStorageServiceService = inject(LocalStorageServiceService);
  baseUrl =  'http://localhost:5012/api/SaleDisplay/SaleDisplay';
  private http = inject(HttpClient);
  public errors: string[] = [];
  token = this.localStorageServiceService.getVairbel('token');

  async getPurchases(iQueryParams: IQueryParams): Promise<IGetPurchases[]>{
    try {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
      let params = new HttpParams()
        if(iQueryParams.isDescendingDate) params = params.set('isDescendingDate', iQueryParams.isDescendingDate.toString());
        if(iQueryParams.userName) params = params.set('userName', iQueryParams.userName);
        if(iQueryParams.page) params = params.set('page', iQueryParams.page.toString());
        if(iQueryParams.pageSize) params = params.set('pageSize', iQueryParams.pageSize.toString());

        const response = await firstValueFrom(this.http.get<IGetPurchases[]>(this.baseUrl, { params: params, headers: headers }));
        return Promise.resolve(response);

    }catch(error: any){
      console.log('Error in getPurchases service', error);

      if(error instanceof HttpErrorResponse){
        const errorMessage =
          typeof error.error === 'string' ? error.error : error.error.message || error.statusText || 'Unknown Server Error in getPurchases service';
        this.errors.push(errorMessage);
      }
      return Promise.reject(error);
    }
  }
}
