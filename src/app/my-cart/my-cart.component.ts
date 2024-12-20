import { Component, inject, NgModule, OnInit } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { NzQRCodeModule } from 'ng-zorro-antd/qr-code';
import { CommonModule } from '@angular/common';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMessageService } from 'ng-zorro-antd/message';  // Added for showing messages
import { MatBottomSheet } from '@angular/material/bottom-sheet';

@Component({
  selector: 'app-my-cart',
  templateUrl: './my-cart.component.html',
  styleUrls: ['./my-cart.component.css'],
  imports: [
    RouterModule,
    CommonModule,
    NzButtonModule,
    NzIconModule,
    NzSwitchModule,
    NzDropDownModule,
    NzSelectModule,
    FormsModule,
    HttpClientModule,
    NzQRCodeModule
  ],
})
export class MyCartComponent implements OnInit {





  cart: any[] = [];
  paymentStatus: string = 'pending';
  bank_account: string = 'heng_puyvong@aclb';
  merchant_name: string = 'puyvongheng';
  merchant_city: string = 'Phnom Penh';
  amount: number = 0; // Default amount (2 USD)
  currency: string = 'USD';
  store_label: string = 'tes';
  phone_number: string = '069717070';
  bill_number: string = '';
  terminal_label: string = 'POS-03';
  static = false;
  price: number = 2; // Price after conversion

  // Conversion rates
  usdToKhrRate: number = 4100; // 1 USD = 4100 KHR
  khrToUsdRate: number = 1 / 4100; // 1 KHR = 1/4100 USD

  qr: string = ''; // QR code to be generated
  md5: string = '';
  Status: string = '';
  isGenerating: boolean = false; // Flag to indicate if the QR code is being generated
  responseMessage: string = '';

  constructor(
    private http: HttpClient,
    private router: Router,
    private message: NzMessageService  // Injected message service
  ) { }

  ngOnInit(): void {
    const storedData = JSON.parse(localStorage.getItem('data') || '{}');
    this.cart = storedData.cart || [];
  }

  get totalPrice(): number {
    return this.cart.reduce((acc, product) => acc + product.price, 0);
  }

  removeFromCart(product: any) {
    this.cart = this.cart.filter((item) => item.id !== product.id);
    this.updateLocalStorage();
    this.message.success(`${product.name} has been removed from your cart!`);  // User feedback
  }

  submitPayment() {
    if (this.cart.length === 0) {
      this.message.error('Your cart is empty. Please add items to proceed with the payment.');  // Error feedback
      return;
    }

    const storedData = JSON.parse(localStorage.getItem('data') || '{}');
    const newOrder = {
      id: this.bill_number,
      status: this.Status,
      items: this.cart,
      bill_number: this.bill_number,
      md5: this.md5,
      qr: this.qr,
    };

    storedData.orders = storedData.orders || [];
    storedData.orders.push(newOrder);
    storedData.cart = []; // Reset cart

    localStorage.setItem('data', JSON.stringify(storedData));

    setTimeout(() => {
      this.router.navigate(['/my-orders']);  // Redirect to My Orders after payment submission
    }

      , 5000);
  }

  private updateLocalStorage() {
    const storedData = JSON.parse(localStorage.getItem('data') || '{}');
    storedData.cart = this.cart;
    localStorage.setItem('data', JSON.stringify(storedData));
  }

  convertCurrency() {
    if (this.currency === 'USD') {

      this.amount = this.totalPrice;  // No change if USD selected
    } else if (this.currency === 'KHR') {
      this.amount = this.totalPrice * this.usdToKhrRate;  // Convert to KHR
    }
  }

  generateBillNumber(): string {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = String(now.getFullYear()).slice(-2);
    const hours = String(now.getHours()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    return `TRX${day}${month}${year}${hours}${seconds}`;
  }

  generateQR(): void {
    this.convertCurrency();
    this.isGenerating = true;
    this.generateMD5();
    const data = {
      bank_account: this.bank_account,
      merchant_name: this.merchant_name,
      merchant_city: this.merchant_city,
      amount: this.amount,
      currency: this.currency,
      store_label: this.store_label,
      phone_number: this.phone_number,
      bill_number: this.bill_number,
      terminal_label: this.terminal_label,
      static: this.static,
    };

    this.http.post('https://khqr-service.onrender.com/generate_qr', data)
      .subscribe(
        (response: any) => {
          this.qr = response.qr;
          this.isGenerating = false;
          this.submitPayment();
        },
        (error) => {
          this.isGenerating = false;
          this.message.error('Failed to generate QR. Please try again!');  // Error feedback
        }
      );
    this.bill_number = this.generateBillNumber();
  }

  generateMD5() {
    const data = { qr: this.qr };
    this.http.post('https://khqr-service.onrender.com/generate_md5', data)
      .subscribe(
        (response: any) => {
          this.md5 = response.md5;  // Assuming the md5 value is directly available
        },
        (error) => {
          this.message.error('Failed to generate MD5. Please try again!');  // Error feedback
        }
      );
  }

  checkPayment() {
    const data = { md5: this.md5 };
    this.http.post('https://khqr-service.onrender.com/check_payment', data)
      .subscribe(
        (response: any) => {
          this.Status = response.status;
        },
        (error) => {
          this.message.error('Payment status check failed. Please try again!');  // Error feedback
        }
      );
  }
}
