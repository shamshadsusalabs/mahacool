import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
export interface Manager {
  _id?: string; // Optional if generated by the backend
  name: string;
  email: string;
  password: string;
  mobile: string;
}
@Injectable({
  providedIn: 'root'
})
export class ManagerService {

  private apiUrl = 'https://mahacool-436606.el.r.appspot.com/api/manager'; // Replace with your actual API endpoint

  constructor(private http: HttpClient) { }

  // Method to add a new client
  addManager(clientData:  Manager): Observable< Manager> {
    return this.http.post< Manager>(`${this.apiUrl}/add`, clientData);
  }


  // Method to get all clients
  getManager(): Observable< Manager[]> {
    return this.http.get<Manager[]>(`${this.apiUrl}/getall`);
  }


  deleteManager(clientId: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/remove`, { id: clientId });
  }

  login(password: string, email: string, mobile?: string): Observable<any> {
    const url = `${this.apiUrl}/login`;
    const body = { email, mobile, password };

    return this.http.post<any>(url, body);
  }

}
