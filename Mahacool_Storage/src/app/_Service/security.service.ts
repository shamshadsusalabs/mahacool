import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
export interface Security {
  _id?: string; // Optional if generated by the backend
  name: string;
  email: string;
  password: string;
  mobile: string;
}
@Injectable({
  providedIn: 'root'
})
export class SecurityService {
  private apiUrl = 'https://mahacool-436606.el.r.appspot.com/api/security'; // Replace with your actual API endpoint

  constructor(private http: HttpClient) { }

  // Method to add a new client
  addManager(clientData:   Security): Observable<Security> {
    return this.http.post<Security>(`${this.apiUrl}/add`, clientData);
  }


  // Method to get all clients
  getSecurity(): Observable<Security[]> {
    return this.http.get<Security[]>(`${this.apiUrl}/getall`);
  }


  deleteSecurity(clientId: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/remove`, { id: clientId });
  }





}
