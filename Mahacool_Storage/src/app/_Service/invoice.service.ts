import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {

  private baseUrl = 'http://localhost:3000/api/MonthlyInvoice'; // Update with your API base URL

  constructor(private http: HttpClient) {}

  // Get all invoices
  getAllInvoices(): Observable<any> {
    return this.http.get(`${this.baseUrl}/getAll`);
  }

  // Get invoice by customerId
  getInvoiceByCustomerId(customerId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/getByCustomerId/${customerId}`);
  }
}
