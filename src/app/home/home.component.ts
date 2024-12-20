import { CommonModule } from '@angular/common';
import { Component, TemplateRef } from '@angular/core';
import {
  MatBottomSheetModule,
} from '@angular/material/bottom-sheet';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzIconModule, NzIconService } from 'ng-zorro-antd/icon';

import { HomeOutline, PlusSquareOutline, UserOutline } from '@ant-design/icons-angular/icons';
// Import only the icons you need (Recommended)
import { NzImageModule } from 'ng-zorro-antd/image';
import { NzMessageService } from 'ng-zorro-antd/message';


@Component({
  selector: 'app-home',
  imports: [
    CommonModule, MatBottomSheetModule, NzButtonModule, NzDrawerModule, NzImageModule
  ],


  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],


})




export class HomeComponent {

  constructor(private iconService: NzIconService, private message: NzMessageService) {
    this.iconService.addIcon(UserOutline, HomeOutline);
  }

  products = [
    {
      id: '101',
      name: 'T-Shirt',
      description: 'High-quality cotton T-shirt with multiple sizes and colors available.',
      category: 'Clothing',
      brand: 'FashionBrand',
      price: 14.99,
      thumbnail: ['https://img.sonofatailor.com/images/customizer/product/highneck/DeepBlue_Regular.jpg'],
      variants: [
        {
          variant_id: '101A',
          color: 'Red',
          size: 'S',
          price: 14.99,
          stock: 30,
          images: ['htimg.sonofatailor.com/images/customizer/product/highneck/DeepBlue_Regular.jpg'],
        },
        {
          variant_id: '101B',
          color: 'Red',
          size: 'M',
          price: 15.99,
          stock: 50,
          images: ['https://cdn.prod.website-files.com/6256995755a7ea0a3d8fbd11/6257ec4fcb33ee42cdba135e_61b9b7e9effa0fc28ea1bf51_Frame%25207.jpeg'],
        },
        {
          variant_id: '101C',
          color: 'Blue',
          size: 'L',
          price: 16.99,
          stock: 40,
          images: ['https://welcomeleeds.com/cdn/shop/files/TopHeavyCorpoTee_600x600_crop_center.jpg'],
        },
        {
          variant_id: '101D',
          color: 'Blue',
          size: 'XL',
          price: 17.99,
          stock: 20,
          images: ['https://img01.ztat.net/article/spp-media-p1/5589c986aa8b4c4f96be3bcbdd2c3d70/7c04b4e9ac6149ae87a5cea02871eef3.jpg?'],
        },
      ],
      seller: {
        id: '5003',
        name: 'FashionHub',
        rating: 4.7,
        location: 'Bangkok, Thailand',
      },
      shipping: {
        cost: 4.99,
        duration: '5-10 days',
        locations: ['Asia', 'Europe', 'USA'],
      },
    },
    {
      id: '101',
      name: 'T-Shirt dddd',
      description: ' sizes and colors available.',
      category: 'Clothing',
      brand: 'FashionBrand',
      price: 14.99,
      thumbnail: ['https://nobero.com/cdn/shop/files/og.jpg?'],
      variants: [
        {
          variant_id: '101A',
          color: 'Red',
          size: 'S',
          price: 14.99,
          stock: 30,
          images: ['https://img.sonofatailor.com/images/customizer/product/highneck/DeepBlue_Regular.jpg'],
        },
        {
          variant_id: '101B',
          color: 'Red',
          size: 'M',
          price: 15.99,
          stock: 50,
          images: ['https://cdn.prod.website-files.com/6256995755a7ea0a3d8fbd11/6257ec4fcb33ee42cdba135e_61b9b7e9effa0fc28ea1bf51_Frame%25207.jpeg'],
        },
        {
          variant_id: '101C',
          color: 'Blue',
          size: 'L',
          price: 16.99,
          stock: 40,
          images: ['https://welcomeleeds.com/cdn/shop/files/TopHeavyCorpoTee_600x600_crop_center.jpg'],
        },
        {
          variant_id: '101D',
          color: 'Blue',
          size: 'XL',
          price: 17.99,
          stock: 20,
          images: ['https://img01.ztat.net/article/spp-media-p1/5589c986aa8b4c4f96be3bcbdd2c3d70/7c04b4e9ac6149ae87a5cea02871eef3.jpg?'],
        },
      ],
      seller: {
        id: '5003',
        name: 'FashionHub',
        rating: 4.7,
        location: 'Bangkok, Thailand',
      },
      shipping: {
        cost: 4.99,
        duration: '5-10 days',
        locations: ['Asia', 'Europe', 'USA'],
      },
    },
  ];

  visible = false;


  openDrawer(product: any) {
    this.selectedProduct = product;
    this.visible = true;
  }

  closeDrawer() {
    this.visible = false;
    this.selectedProduct = null;
  }

  selectedProduct: any = null;

  showVariants(product: any) {
    this.selectedProduct = product;
  }

  addToCart(variant: any): void {
    const storedData = JSON.parse(localStorage.getItem('data') || '{}');
    const cart = storedData.cart || [];
    cart.push(variant);
    storedData.cart = cart;
    localStorage.setItem('data', JSON.stringify(storedData));

    this.createBasicMessage()
  }


  createBasicMessage() {
    this.message.success(' success', {
      nzDuration: 10000
    });
  }


}