import { Component, Input, NgIterable, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { IOrder } from 'src/app/models/order';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit{
  @Input() order:IOrder;
  @Input() status: string;
  form: FormGroup;
  
  orderStatuses: {[key:string]: string} = {
    ACCEPTED :"ЗАКАЗ ОБРАБАТЫВЕТСЯ",
    COOKING :"ГОТОВИТСЯ",
    DELIVERING :"ДОСТАВЛЯЕТСЯ",
    DELIVERED :"ДОСТАВЛЕНО",
    REJECTED :"ОТМЕНЕНО"
  }

  constructor(private orderService: OrderService) {}
  
  ngOnInit(): void {
    this.form = new FormGroup({
      state: new FormControl(this.status)
    })
  }

  getStatusesAsArray(): any[] {
    const arr = []
    for (let prop in this.orderStatuses) {
      arr.push(prop)
    }
    return arr
  }

  // Do UPDATE request to backend.
  updateStatus() {
    this.orderService.updateStatus(this.order.id, this.form.value.state).subscribe();
  }

}