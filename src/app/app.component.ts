import { Component, NgModule } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { NzButtonModule, NzButtonSize } from 'ng-zorro-antd/button';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';  // <-- Import FormsModule here



import { NzQRCodeModule } from 'ng-zorro-antd/qr-code';
import { CommonModule } from '@angular/common';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';


import { NzIconModule } from 'ng-zorro-antd/icon';








@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterModule, CommonModule, NzButtonModule, NzIconModule, NzSwitchModule, NzDropDownModule, NzSelectModule, NzButtonModule, FormsModule, HttpClientModule, NzQRCodeModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  size: NzButtonSize = 'large';


  // Declare form fields
  bank_account: string = 'heng_puyvong@aclb';
  merchant_name: string = 'puyvongheng';
  merchant_city: string = 'Phnom Penh';
  amount: number = 0;                    // Default amount (2 USD)
  currency: string = 'USD';
  store_label: string = 'tes';
  phone_number: string = '069717070'; // Treated as a string
  bill_number: string = '';
  terminal_label: string = 'POS-03';

  static = false;


  price: number = 2; // Price after conversion

  // Conversion rates
  usdToKhrRate: number = 4100;  // 1 USD = 4100 KHR
  khrToUsdRate: number = 1 / 4100; // 1 KHR = 1/4100 USD

  // Method to handle currency conversion
  convertCurrency() {
    if (this.currency === 'USD') {
      this.amount = this.price; // Price stays the same if USD is selected
    } else if (this.currency === 'KHR') {
      this.amount = this.price * this.usdToKhrRate; // Convert to KHR
    }
  }



  //for qr_for_deeplink

  qr_for_deeplink = '';
  callback_url = '';
  appIconUrl = '';
  appName = '';


  qr_for_md5 = '';
  md5_for_payment = '';



  md5_list: string[] = ['d41d8cd98f00b204e9800998ecf8427e', 'd41d8cd98f00b204e9800998ecf8427e'];  // Use an array with string literals

  new_token = '';


  responseMessage = '';

  constructor(private http: HttpClient) { }

  qr: string = '';  // Declare the qr variable
  md5: string = '';
  Status: string = '';
  Statuslist: string = '';
  isGenerating: boolean = false;  // Flag to indicate if the QR code is being generated



  // Convert currency based on selection

  generateBillNumber(): string {
    const now = new Date(); // Get the current date and time
    const day = String(now.getDate()).padStart(2, '0'); // Day (2 digits)
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Month (2 digits, 0-indexed)
    const year = String(now.getFullYear()).slice(-2); // Last 2 digits of the year
    const hours = String(now.getHours()).padStart(2, '0'); // Hours (2 digits)
    const seconds = String(now.getSeconds()).padStart(2, '0'); // Seconds (2 digits)

    return `TRX${day}${month}${year}${hours}${seconds}`; // Combine to form bill number
  }


  // Generate QR
  generateQR(): void {
    this.convertCurrency()
    this.isGenerating = true;  // Set to true when the process starts

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
      static: this.static
    };

    this.http.post('https://khqr-service.onrender.com/generate_qr', data)
      .subscribe(
        (response: any) => {

          this.qr = response.qr;  // Assign the response QR code to the qr variable
          this.isGenerating = false;  // Set to false once the QR is generated


          this.responseMessage = JSON.stringify(response);
        },
        (error) => {
          this.responseMessage = error;
          this.isGenerating = false;  // Set to false even if there's an error


        }
      );
    this.bill_number = this.generateBillNumber()

    this.generateMD5() //run funtion g md5
    this.checkPayment()//run funtion chack paly ment 
  }






  // Generate Deeplink
  generateDeeplink() {
    const data = {
      qr: this.qr_for_deeplink,
      callback: this.callback_url,
      appIconUrl: this.appIconUrl,
      appName: this.appName
    };

    this.http.post('https://khqr-service.onrender.com/generate_deeplink', data)
      .subscribe(
        (response: any) => {
          this.responseMessage = JSON.stringify(response);
        },
        (error) => {
          this.responseMessage = error;
        }
      );
  }

  // Generate MD5
  generateMD5() {
    const data = { qr: this.qr };

    this.http.post('https://khqr-service.onrender.com/generate_md5', data)
      .subscribe(
        (response: any) => {
          this.md5 = JSON.stringify(response);
          this.responseMessage = JSON.stringify(response);
        },
        (error) => {
          this.responseMessage = error;
        }
      );
  }

  // Check Payment
  checkPayment() {
    const data = { md5: this.md5 };

    this.http.post('https://khqr-service.onrender.com/check_payment', data)
      .subscribe(
        (response: any) => {
          this.Status = JSON.stringify(response);
          this.responseMessage = JSON.stringify(response);
        },
        (error) => {
          this.responseMessage = error;
        }
      );
  }

  ngOnInit(): void {
    this.checkBulkPayments(); // Automatically call checkBulkPayments when the component initializes
  }
  // Check Bulk Payments
  checkBulkPayments() {
    const data = { md5_list: this.md5_list };  // Directly pass the array

    this.http.post('https://khqr-service.onrender.com/check_bulk_payments', data)
      .subscribe(
        (response: any) => {
          this.Statuslist = JSON.stringify(response);
        },
        (error) => {
          this.responseMessage = error;
        }
      );
  }


  // Update Token
  updateToken() {
    const data = { BAKONG_TOKEN: this.new_token };

    this.http.post('https://khqr-service.onrender.com/update_token', data)
      .subscribe(
        (response: any) => {
          this.responseMessage = JSON.stringify(response);
        },
        (error) => {
          this.responseMessage = error;
        }
      );
  }
}
