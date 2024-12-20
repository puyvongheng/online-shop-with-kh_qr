import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-orders',
  imports: [CommonModule, HttpClientModule,],
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.css']
})

export class MyOrdersComponent implements OnInit {
  orders: any[] = [];
  selectedOrderIndex: number | null = null; // Store the index of the selected order
  md5: string = ''; // For single payment checks
  md5_list: string[] = []; // For bulk payment checks

  Status: string[] = []; // For bulk payment checks

  Statuslist: string = '';
  responseMessage: string = '';

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit() {
    // Retrieve the orders from localStorage
    const storedData = JSON.parse(localStorage.getItem('data') || '{}');
    this.orders = storedData.orders || [];

    // Populate md5_list from orders
    this.md5_list = this.orders.map(order => order.md5);
    this.checkPayment()
    this.checkBulkPayments()


    // Check single payment status
    this.checkPayment();

    // Check bulk payments for all orders
    this.checkBulkPayments();

    // Check payment status for each order (optional)
  }


  // Check payment status for a specific MD5 (This could be a default MD5 from the list)
  checkPayment() {
    if (this.md5) {
      const data = { md5: this.md5 };

      this.http.post('https://khqr-service.onrender.com/check_payment', data).subscribe(
        (response: any) => {
          this.Status = response.status; // Update the status from the response
          this.responseMessage = 'Payment status checked successfully.';
        },
        (error) => {
          this.responseMessage = `Error checking payment: ${error.error?.message || error.message}`;
        }
      );
    } else {
      this.responseMessage = 'Please provide a valid MD5.';
    }
  }

  // Check bulk payments for all orders
  checkBulkPayments() {
    const data = { md5_list: this.md5_list };  // Directly pass the array

    this.http.post('https://khqr-service.onrender.com/check_bulk_payments', data)
      .subscribe(
        (response: any) => {
          this.Statuslist = JSON.stringify(response); // Store the response as string
        },
        (error) => {
          this.responseMessage = `Error checking bulk payments: ${error.error?.message || error.message}`;
        }
      );
  }




  // Check bulk payments

  // Clear all orders
  clearAllOrders() {
    // Clear the orders array in the component
    this.orders = [];

    // Remove the orders from localStorage
    localStorage.removeItem('data');
    this.responseMessage = 'All orders cleared successfully.';
  }

  // Toggle the visibility of order details
  toggleOrderDetails(index: number) {
    // Toggle between showing and hiding details of the clicked order
    this.selectedOrderIndex = this.selectedOrderIndex === index ? null : index;
  }

  // Calculate the total price of each order
  getTotalPrice(order: any): number {
    return order.items.reduce((acc: any, item: { price: any }) => acc + item.price, 0);
  }

  // Get items for the given order
  getOrderItems(order: any): any[] {
    return order.items || [];
  }
}


