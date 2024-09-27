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
  warehouseName: string;
  rackName: string;
  dateCheckIN: string;
  name: string;
  recordId: string;
  typeOfSack: string;
  weight: number;
  customerId: string;

}

interface CheckInHistory {
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
  imports: [CommonModule, FormsModule, RouterLink, RouterOutlet, RouterModule, AddGunnyBagComponent, QrCodeComponent],
  templateUrl: './bag.component.html',
  styleUrls: ['./bag.component.css']
})
export class BagComponent implements OnInit {
  items: Item[] = []; // All items fetched from the service
  filteredItems: Item[] = []; // Items after filtering
  paginatedItems: DryFruit[] = []; // Items for the current page
  selectedDate: string | null = null; // Date picker value
  searchTerm: string = ''; // Search bar value
  currentPage: number = 1; // Current pagination page
  itemsPerPage: number = 5; // Items to show per page

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
        this.items = data;
        console.log(this.items);
        this.filteredItems = data;
        console.log(this.filteredItems); // Initialize filtered items
        this.updatePaginatedItems(); // Update pagination on fetch
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

  filterDataByDate() {
    if (this.selectedDate) {
      this.filteredItems = this.items.filter(item =>
        item.checkInHistory.some(checkIn =>
          checkIn.dryFruits.some(dryFruit =>
            new Date(dryFruit.dateCheckIN).toISOString().split('T')[0] === this.selectedDate
          )
        )
      );
    } else {
      this.filteredItems = this.items; // No date selected, show all items
    }
    this.currentPage = 1; // Reset to first page after filtering
    this.updatePaginatedItems(); // Update pagination after filtering
  }

  searchData() {
    const lowerCaseTerm = this.searchTerm.toLowerCase();
    this.filteredItems = this.items.filter(item =>
      item.checkInHistory.some(checkIn =>
        checkIn.dryFruits.some(dryFruit =>
          dryFruit.cityName.toLowerCase().includes(lowerCaseTerm) ||
          dryFruit.warehouseName.toLowerCase().includes(lowerCaseTerm) ||
          dryFruit.rackName.toLowerCase().includes(lowerCaseTerm) ||
          dryFruit.customerId.toLowerCase().includes(lowerCaseTerm)
        )
      )
    );
    this.currentPage = 1; // Reset to first page after searching
    this.updatePaginatedItems(); // Update pagination after searching
  }

  // Pagination methods
  updatePaginatedItems() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;

    // Flattening filteredItems to get DryFruit objects
    const allDryFruits: DryFruit[] = this.filteredItems.flatMap(item =>
      item.checkInHistory.flatMap(checkIn => checkIn.dryFruits)
    );

    this.paginatedItems = allDryFruits.slice(startIndex, endIndex);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginatedItems();
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedItems();
    }
  }

  get totalPages() {
    const totalDryFruits = this.filteredItems.flatMap(item =>
      item.checkInHistory.flatMap(checkIn => checkIn.dryFruits)
    ).length;

    return Math.ceil(totalDryFruits / this.itemsPerPage);
  }

  // Modal control methods
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
