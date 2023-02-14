import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Observer, retry, Subscriber } from 'rxjs';
import { getAuthToken } from 'src/utils';
import { IOrder, OrderStatus } from '../models/order';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  orders: IOrder[] = []

  constructor(private http: HttpClient) {}

  // Fetch amount orders from API
  getOrders(offset: number, amount: number): Observable<IOrder[]> {
    return this.http.get<IOrder[]>(
      `api/v1/order?offset=${offset}&amount=${amount}`,
      {
        headers:
          {
            'Content-Type': 'application/json',
            Authorization: getAuthToken()
          }
      }
    ).pipe(retry(2))
  }

  updateStatus(orderID: string, status: OrderStatus) {
    return this.http.patch<IOrder>(
      `api/v1/order/${orderID}`,
      {
        status
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: getAuthToken()
        }
      }
    ).pipe(retry(2))
  }
}
