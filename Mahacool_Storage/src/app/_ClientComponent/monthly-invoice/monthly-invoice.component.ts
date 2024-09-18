import { Component } from '@angular/core';
import { InvoiceService } from '../../_Service/invoice.service';
import { CommonModule } from '@angular/common';


interface DryFruitDetail {
  amount: number;
  dateCheckIN: string;
  dryFruitName: string;
  recordId: string;
  storageDays: number;
  weight: number;
  _id: string;
}

interface CustomerInvoice {
  _id: string;
  customerId: string;
  dryFruitDetails: DryFruitDetail[];
  grandTotalAmount: number;
  grandTotalWeight: number;
  paidGrandTotalAmounts: number[];
  paidMonthlyTotals: { [key: string]: number };
  unpaidMonthly: { [key: string]: number };
  __v: number;
}



@Component({
  selector: 'app-monthly-invoice',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './monthly-invoice.component.html',
  styleUrls: ['./monthly-invoice.component.css']
})
export class MonthlyInvoiceComponent {
  customerInvoice: CustomerInvoice | null = null;
  errorMessage: string | null = null;

  constructor(private invoiceService: InvoiceService) {}

  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const customerId = user.customerID;

    if (customerId) {
      this.getInvoiceForCustomer(customerId);
    } else {
      this.errorMessage = 'Customer ID not found in local storage';
    }
  }

  getInvoiceForCustomer(customerId: string): void {
    this.invoiceService.getInvoiceByCustomerId(customerId).subscribe(
      (data) => {
        this.customerInvoice = data;
        console.log(this.customerInvoice);
      },
      (error) => {
        this.errorMessage = `Error fetching invoice for customer ${customerId}`;
        console.error(this.errorMessage, error);
      }
    );
  }

  // Get months from unpaidMonthly to display in the cards
  getMonths(monthlyTotals: { [key: string]: number } | undefined): string[] {
    return monthlyTotals ? Object.keys(monthlyTotals) : [];
  }

  // Calculate remaining amount (unpaid - paid) for each month
  calculateRemainingAmount(month: string): number {
    const unpaid = this.customerInvoice?.unpaidMonthly[month] || 0;
    const paid = this.customerInvoice?.paidMonthlyTotals[month] || 0;
    return unpaid - paid;
  }

  // Calculate grand total payable by subtracting all amounts from paidGrandTotalAmounts
  calculateGrandTotalPayable(): number {
    const totalPaid = this.customerInvoice?.paidGrandTotalAmounts.reduce(
      (sum, amount) => sum + amount,
      0
    ) || 0;
    const grandTotalAmount = this.customerInvoice?.grandTotalAmount || 0;
    return grandTotalAmount - totalPaid;
  }
}
