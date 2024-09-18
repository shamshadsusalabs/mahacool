import { Component } from '@angular/core';
import { GunnyBagService } from '../../_Service/gunny-bag.service';
import Swal from 'sweetalert2';
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

interface checkOutHistory
{
  date: string;
  dryFruits: DryFruit[];
  _id: string;
}

interface Item {
  _id: string;
  checkInHistory: any[];
  checkOutHistory: checkOutHistory[];
  customerId: string;
  totalWeightByFruit: Record<string, number>;

}
@Component({
  selector: 'app-checkout-hodtory',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './checkout-hodtory.component.html',
  styleUrl: './checkout-hodtory.component.css'
})
export class CheckoutHodtoryComponent {

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
    Swal.fire({
      title: 'Fetching data...',
      text: 'Please wait while the data is being fetched.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    this.gunnyBagService.getCustomerDetails().subscribe({
      next: (data) => {
        console.log('Fetched data:', data); // Debugging line
        if (data && typeof data === 'object' && !Array.isArray(data)) {
          this.items = [data]; // Wrap the single object in an array
          this.applyFilter(); // Apply filter after fetching data
        } else {
          console.error('Unexpected data format:', data);
          this.items = []; // Fallback to empty array
        }
        Swal.close(); // Close the loading indicator automatically
      },
      error: (error) => {
        console.error('Error fetching data:', error);
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
        item.checkOutHistory.some(history =>
          history.dryFruits.some(dryFruit =>
            dryFruit.cityName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
            dryFruit.warehouseName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
            dryFruit.rackName.toLowerCase().includes(this.searchTerm.toLowerCase())
          )
        )
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


}

