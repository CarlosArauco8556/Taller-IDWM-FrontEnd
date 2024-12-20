import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserManagementService {
  baseUrl: string = "http://localhost:5012/api/UserManagement";
  private http = inject(HttpClient);
  public errors: string[] = [];

  async getUsers(){
    
  }

  async changeState(){

  }
}