import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AdminService } from '../../_Service/admin.service';

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

    private adminService: AdminService,
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

}
