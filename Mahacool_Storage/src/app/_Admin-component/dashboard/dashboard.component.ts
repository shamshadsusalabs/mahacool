import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AdminService } from '../../_Service/admin.service';
import { WeightService } from '../../_Service/weight.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [FormsModule,CommonModule,RouterOutlet,RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  isSidebarOpen = false;


  constructor(

    private adminService: AdminService,private weightService:  WeightService,
    private route:Router)

    {}


  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  logout() {


      localStorage.removeItem('user');
      // Navigate to the home page or login page
      this.route.navigate(['']);

  }

  isHistoryOpen = false;

  toggleHistory() {
    this.isHistoryOpen = !this.isHistoryOpen;
  }

  isInvoices = false;

  toggleInvoive() {
    this.isInvoices = !this.isInvoices;
  }



  weight: string = ''; // Variable to store the real-time weight



  ngOnInit(): void {
    // Subscribe to the WebSocket data stream
    this.weightService.getRealTimeWeight().subscribe(
      (newWeight) => {
        this.weight = newWeight; // Update the weight in real time
      },
      (error) => {
        console.error('Error receiving weight data', error);
      }
    );
  }





}
