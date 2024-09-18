import { Component, OnInit } from '@angular/core';
import { WarehouseService } from '../../_Service/warehouse.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface WarehouseRequest {
  bora: number;
  cityName: string;
  dryFruitName: string;
  rate: string;
  totalweight: number;
  warehouseId: string;
  warehouseName: string;
  _iddetails: string;
}

@Component({
  standalone: true,
  imports: [FormsModule, CommonModule],
  selector: 'app-confim-requested-warehouse',
  templateUrl: './confim-requested-warehouse.component.html',
  styleUrls: ['./confim-requested-warehouse.component.css']
})
export class ConfimRequestedWarehouseComponent implements OnInit {
  warehouseRequests: WarehouseRequest[] = [];

  constructor(private warehouseService: WarehouseService) {}

  ngOnInit(): void {
    this.updateStatusByUser();
  }

  updateStatusByUser(): void {
    const userId = this.getUserIdFromLocalStorage();
    if (userId) {
      this.warehouseService.getDetailsByCustomerID(userId).subscribe(
        response => {
          if (Array.isArray(response)) {
            this.warehouseRequests = response;
          } else {
            console.error('Unexpected response format:', response);
          }
        },
        error => {
          console.error('Error updating status:', error);
        }
      );
    } else {
      console.error('No user ID found in localStorage.');
    }
  }

  private getUserIdFromLocalStorage(): string | null {
    const user = localStorage.getItem('user');
    if (user) {
      const userObj = JSON.parse(user);
      return userObj.customerID || null;
    }
    return null;
  }
}
