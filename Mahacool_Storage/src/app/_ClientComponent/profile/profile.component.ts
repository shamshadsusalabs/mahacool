import { Component } from '@angular/core';
import { Client, ClientService } from '../../_Service/client.service';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  clientDetails: Client | null = null;
  error: string | null = null;

  updatedDetails: any = {
    _id: '',
    name: '',
    password: '',
    bussinessName: '',
    email: '',
    mobile: '',
    address: '',
    gstNumber: '',
    image: ''
  };
  imagePreview: string | ArrayBuffer | null = null;
  isModalOpen = false;
  defaultImage = 'logo/Admin.png'; // Path to a default image if needed

  constructor(private clientService: ClientService) { }

  ngOnInit(): void {
    // Retrieve ID from local storage
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const clientId = user._id; // Assuming `_id` is the ID in your user object

    if (clientId) {
      this.clientService.getClientDetails(clientId).subscribe(
        (data: Client) => {
          this.clientDetails = data;
          this.updatedDetails = { ...data }; // Initialize updatedDetails with fetched data
        },
        (error) => {
          console.error('Error fetching client details:', error);
          this.error = 'Failed to load client details. Please try again later.';
        }
      );
    } else {
      this.error = 'User ID not found in local storage.';
    }
  }

  openModal() {
    this.isModalOpen = true;
    this.imagePreview = this.clientDetails?.image || this.defaultImage;
    this.updatedDetails = { ...this.clientDetails } || this.updatedDetails; // Populate form with clientDetails or keep default
  }

  closeModal() {
    this.isModalOpen = false;
  }

  onImageChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        const result = e.target?.result;
        if (result) {
          this.imagePreview = result as string | ArrayBuffer; // Type assertion to handle `undefined`
        }
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const clientId = user._id; // Assuming `_id` is the ID in your user object

    // Convert image to Base64 if imagePreview is not null
    const imageBase64 = this.imagePreview ? (this.imagePreview as string).split(',')[1] : '';

    // Combine updatedDetails and imageBase64
    const updatedData = { ...this.updatedDetails, image: imageBase64 };
    console.log(updatedData);

    // Perform the update request to your backend
    this.clientService.updateClientPassword(clientId, updatedData).subscribe(
      (data: any) => {
        console.log(data);

        // Show SweetAlert success message
        Swal.fire({
          title: 'Success!',
          text: 'Your details have been successfully updated.',
          icon: 'success',
          confirmButtonText: 'OK'
        });
        this.closeModal();
        this.ngOnInit();
      },
      (error: any) => {
        // Handle error if needed
        console.error(error);
        Swal.fire({
          title: 'Error!',
          text: 'There was an issue updating your details. Please try again later.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    );
  }
}
