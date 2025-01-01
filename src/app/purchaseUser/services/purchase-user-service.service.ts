import { inject, Injectable } from '@angular/core';
import { LocalStorageServiceService } from '../../_shared/services/local-storage-service.service';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { INewPurchase } from '../interfaces/INewPurchase';
import { firstValueFrom } from 'rxjs';
import { IGetPurchases } from '../interfaces/IGetPurchases';

@Injectable({
  providedIn: 'root'
})
export class PurchaseUserServiceService {

  localStorageServiceService: LocalStorageServiceService = new LocalStorageServiceService();
  baseUrl = 'http://localhost:5012/api';
  private http = inject(HttpClient);
  public errors: string[] = [];
  token = this.localStorageServiceService.getVairbel('token');


  async postPurchaseUser(formData: any): Promise<INewPurchase[]> {
    try {
      const headers = new HttpHeaders()
        .set('Authorization', `Bearer ${this.token}`)
        .set('Content-Type', 'application/json');  
  
      
      const response = await firstValueFrom(
        this.http.post<INewPurchase[]>(`${this.baseUrl}/Purchase/NewPurchase`, formData, { headers })
      );
      return response;
    } catch (error) {
      if (error instanceof HttpErrorResponse) {
        const errorMessage =
          typeof error.error === 'string' ? error.error : error.message;
        this.errors.push(errorMessage);
      }
      return Promise.reject(error);
    }
  }

  async getPurchaseUser(purchaseId: number): Promise<IGetPurchases[]> {
    try{
      const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
      const response = await firstValueFrom(this.http.get<IGetPurchases[]>(`${this.baseUrl}/Purchase/GetPurchaseRecipt/${purchaseId}`, {headers: headers}));
      return response;
    } catch (error) {
      if(error instanceof HttpErrorResponse)
        {
          const errorMessage = 
            typeof error.error === 'string' ? error.error : error.message;
          this.errors.push(errorMessage);
        }
        return Promise.reject(error);
    }
  }

  getErrors(): string[] {
    return this.errors;
  }


    
}
