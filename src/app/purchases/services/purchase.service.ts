import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { IQueryParams } from '../interfaces/IQueryParams';
import { firstValueFrom } from 'rxjs';
import { IGetPurchases } from '../interfaces/IGetPurchases';

@Injectable({
  providedIn: 'root'
})
export class PurchaseService {
  baseUrl =  'http://localhost:5012/api/SaleDisplay/SaleDisplay';
  private http = inject(HttpClient);
  public errors: string[] = [];

  async getPurchases(iQueryParams: IQueryParams): Promise<IGetPurchases[]>{
    try {
      const token = localStorage.getItem('token') || 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGlkd20uY2wiLCJnaXZlbl9uYW1lIjoiYWRtaW5AaWR3bS5jbCIsIm5hbWVpZCI6IjA3ZTIyNzU0LWNhMjItNDQ5My1iMmZhLTM3ODZjNDRjNWE4MiIsImp0aSI6ImYyZGQyZDIzLTg0MDMtNDRjYi1hNDUxLTU3OWM1YmU1NjkwMSIsInJvbGUiOiJBZG1pbiIsIm5iZiI6MTczNTQyMjU0MCwiZXhwIjoxNzM1NTA4OTQwLCJpYXQiOjE3MzU0MjI1NDAsImlzcyI6ImhodHBzOi8vbG9jYWxob3N0OjUwMDAiLCJhdWQiOiJoaHRwczovL2xvY2FsaG9zdDo1MDAifQ.HBNRLHU7q9edj-lnqId4wkdHcqZOYL7QvvIalgwPtkdvyA1lhcACuQscnCRYzX_3kGhIcJTvkDsteDcXwcfvXg';
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      let params = new HttpParams()
        if(iQueryParams.isDescescendingDate) params = params.set('isDescescendingDate', iQueryParams.isDescescendingDate.toString());
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
