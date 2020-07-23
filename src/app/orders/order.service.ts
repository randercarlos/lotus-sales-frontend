import { catchError, tap } from 'rxjs/operators';
import { Order } from './order.model';
import { Injectable, Injector } from '@angular/core';
import { environment } from './../../environments/environment';
import { BaseCrudService } from '../core/services/base-crud.service';
import { Observable, throwError } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class OrderService extends BaseCrudService<Order> {

  constructor(private injector: Injector) {
    super(environment.apiUrl + '/orders', injector, 'orders');
  }

  public makeSale(order: Order): Observable<Order> {
    return this.http.post<Order>(environment.apiUrl + '/orders', order, {
      headers: new HttpHeaders().set('X-Requested-With', 'XMLHttpRequest')
    })
    .pipe(
      catchError((err: any) => {
        return throwError(`Fail on make sale!`);    //Rethrow it back to component
      })
    );
  }
}
