import { Component } from '@angular/core';
import { GunnyBagService } from '../../../_Service/gunny-bag.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouteConfigLoadEnd } from '@angular/router';

@Component({
  selector: 'app-all-invoices',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './all-invoices.component.html',
  styleUrl: './all-invoices.component.css'
})
export class AllInvoicesComponent {
  customerInvoices: any[] = [];
  filteredInvoices: any[] = [];
  paginatedInvoices: any[] = [];
  searchCustomerId: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 0;
  selectedCustomer: any = { invoices: [] };

  constructor(private gunnyBagService: GunnyBagService) {}

  ngOnInit(): void {
    this.getAllInvoices();
  }

  getAllInvoices(): void {
    this.gunnyBagService.getAllInvoice().subscribe({
      next: (response: any) => {
        console.log(response)
        this.customerInvoices = response.invoices;
        this.filteredInvoices = [...this.customerInvoices];
        this.updatePagination();
      },
      error: (error) => {
        console.error('Error fetching invoices:', error);
      }
    });
  }

  searchInvoices(): void {
    if (this.searchCustomerId.trim() === '') {
      this.filteredInvoices = [...this.customerInvoices];
    } else {
      this.filteredInvoices = this.customerInvoices.filter(customer =>
        customer.customerId.includes(this.searchCustomerId.trim())
      );
    }
    this.updatePagination();
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredInvoices.length / this.itemsPerPage);
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.paginatedInvoices = this.filteredInvoices.slice(startIndex, startIndex + this.itemsPerPage);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  getTotalPayableAmount(invoices: any[]): number {
    return invoices.reduce((sum, invoice) => sum + invoice.totalAmount, 0);
  }

}
