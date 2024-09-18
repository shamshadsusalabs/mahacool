import { Component } from '@angular/core';
import Swal from 'sweetalert2';
import { GunnyBagService } from '../../../../_Service/gunny-bag.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
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
  selector: 'app-allhistory',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './allhistory.component.html',
  styleUrl: './allhistory.component.css'
})
export class AllhistoryComponent {
  items: Item[] = [];
  paginatedItems: Item[] = [];
  searchTerm: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 1;

  constructor(private gunnyBagService: GunnyBagService) {}

  ngOnInit() {
    this.fetchData(); // Fetch data on component initialization
  }

  fetchData() {
    // Show loading indicator
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
        this.items = data; // Assuming `data` is an array of items
        this.applyFilter(); // Apply filter after fetching data

        // Close the loading indicator automatically
        Swal.close();
      },
      error: (error) => {
        console.error('Error fetching data:', error);

        // Close the loading indicator and show an error message
        Swal.fire({
          icon: 'error',
          title: 'Failed to Fetch Data',
          text: 'An error occurred while fetching the data. Please try again.',
          showConfirmButton: false,
          timer: 3000 // Close the alert automatically after 3 seconds
        });
      }
    });
  }



  applyFilter(): void {
    console.log('Applying filter with searchTerm:', this.searchTerm); // Debugging line
    let filteredItems = this.items;

    if (this.searchTerm) {
      filteredItems = this.items.filter(item =>
        item.customerId.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    this.totalPages = Math.ceil(filteredItems.length / this.itemsPerPage);
    this.paginateItems(filteredItems);
    console.log('Filtered items:', this.paginatedItems); // Debugging line
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
    this. openAddModalis = true;
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
