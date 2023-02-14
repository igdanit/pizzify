import { Component, OnInit } from '@angular/core';
import { IOrder } from 'src/app/models/order';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit{

  orders: IOrder[] = [];
  ordersOffset = 0;
  ordersAmount = 10;
  
  constructor(private orderService:OrderService) {}
  
  // Fetch last orders from API
  ngOnInit(): void {
    this.getOrders();
  }

  getOrders(): void {
    this.orderService.getOrders(this.ordersOffset, this.ordersAmount).subscribe(this.setOrders.bind(this));
  }
  
  setOrders(data: IOrder[]): void {
    this.orders = data;
    this.orders.forEach((order: IOrder) => {
      order.createdAt = new Date(order.createdAt); 
    })
    console.log(this.orders)
  }

  previousOrders() {
    if (this.orders.length === this.ordersAmount) {
      this.ordersOffset += this.ordersAmount;
      this.getOrders() 
    }
  }
  
  nextOrders() {
    if (this.ordersOffset > 0) {
      this.ordersOffset = Math.max(0, this.ordersOffset - this.ordersAmount);
      this.getOrders()
    }
  }
}