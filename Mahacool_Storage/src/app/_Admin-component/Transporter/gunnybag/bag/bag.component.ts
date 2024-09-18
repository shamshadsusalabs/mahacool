import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GunnyBagService } from '../../../../_Service/gunny-bag.service';

import { RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { AddGunnyBagComponent } from '../add-gunny-bag/add-gunny-bag.component';
import { QrCodeComponent } from '../qr-code/qr-code.component';
import Swal from 'sweetalert2';


interface DryFruit {
  cityName: string;
  name: string;
  rackName: string;
  recordId: string;
  typeOfSack: string;
  warehouseName: string;
  weight: number;

}

interface CheckInHistory {

dateCheckIN: string;
  dryFruits: DryFruit[];
  _id: string;
}

interface Item {
  _id: string;
  checkInHistory: CheckInHistory[];
  checkOutHistory: any[];
  customerId: string;
  totalWeightByFruit: Record<string, number>;
}

@Component({
  selector: 'app-bag',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, RouterOutlet,RouterModule,AddGunnyBagComponent,QrCodeComponent ],
  templateUrl: './bag.component.html',
  styleUrls: ['./bag.component.css']
})
export class BagComponent implements OnInit {
  items: Item[] = [];
  paginatedItems: Item[] = [];
  searchTerm: string = ''; // This will be used to search both customerId and rackName
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 1;

  constructor(private gunnyBagService: GunnyBagService) {}

  ngOnInit() {
    this.fetchData(); // Fetch data on component initialization
  }

  fetchData() {
    Swal.fire({
      title: 'Fetching data...',
      text: 'Please wait while the data is being fetched.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    this.gunnyBagService.getAllCustomerHistories().subscribe({
      next: (data) => {
        console.log('Fetched data:', data); // Debugging line
        this.items = data; // Assuming data is an array of items
        this.applyFilter(); // Apply filter after fetching data
        Swal.close();
      },
      error: (error) => {
        console.error('Error fetching data:', error);
        Swal.fire({
          icon: 'error',
          title: 'Failed to Fetch Data',
          text: 'An error occurred while fetching the data. Please try again.',
          showConfirmButton: false,
          timer: 3000
        });
      }
    });
  }



  applyFilter(): void {
    // Debugging the search term
    console.log('Applying filter with searchTerm:', this.searchTerm);

    const searchTermLower = this.searchTerm.trim().toLowerCase(); // Process search term
    console.log('Processed searchTerm:', searchTermLower);

    // Filter items based on customerId, cityName, rackName, and warehouseName
    let filteredItems = this.items.filter(item => {
      // Convert customerId to string and lowercase
      const customerIdLower = item.customerId.toString().trim().toLowerCase();

      // Check if customerId matches the search term
      const customerIdMatches = customerIdLower.includes(searchTermLower);

      // Check if any checkInHistory matches based on cityName, rackName, or warehouseName
      const checkInHistoryMatches = item.checkInHistory.some(history => {
        return history.dryFruits.some(dryFruit =>
          dryFruit.rackName.toLowerCase().includes(searchTermLower) ||
          dryFruit.warehouseName.toLowerCase().includes(searchTermLower) ||
          dryFruit.cityName.toLowerCase().includes(searchTermLower)
        );
      });

      // Return item if either customerId or any checkInHistory matches
      return customerIdMatches || checkInHistoryMatches;
    });

    // Debugging filtered results
    console.log('Filtered items:', filteredItems);

    // Update pagination and display results
    this.totalPages = Math.ceil(filteredItems.length / this.itemsPerPage);
    this.paginateItems(filteredItems);
  }










  paginateItems(items: Item[]): void {
    if (items.length === 0) {
      this.paginatedItems = [];
      this.totalPages = 1;
      return;
    }

    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = this.currentPage * this.itemsPerPage;
    this.paginatedItems = items.slice(start, end);
  }

  onSearch(): void {
    this.applyFilter(); // Apply the filter
    this.currentPage = 1; // Reset to the first page after searching
  }

  onPageChange(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.applyFilter(); // Reapply filter to get paginated items for the current page
    }
  }

  openAddModalis = false;
  openAddModal() {
    this.openAddModalis = true;
  }

  closeModalAdd() {
    this.openAddModalis = false;
  }

  isModalOpen = false;
  openModal(): void {
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
  }
}
