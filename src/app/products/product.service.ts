import { Product } from './product.model';
import { Injectable, Injector } from '@angular/core';
import { BaseCrudService } from '../core/services/base-crud.service';
import { environment } from './../../environments/environment';
import { Observable, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProductService extends BaseCrudService<Product> {

  constructor(private injector: Injector) {
    super(environment.apiUrl + '/products', injector, 'products');
  }

  loadAllOrderedByName(): Observable<Product[]> {
    return this.http.get<Product[]>(environment.apiUrl + '/products', {
      headers: new HttpHeaders().set('X-LoadAll-Without-Pagination', 'true')
    })
    .pipe(
      tap(data => console.log(data)),
      catchError((err: any) => {
        return throwError(`Fail on load products ordered by name!`);    //Rethrow it back to component
      })
    );
  }

  public updateProduct(record, id): Observable<Product> {
    console.log('UPDATE: ', record);
    return this.http.put<Product>(`${environment.apiUrl + '/products'}/${id}`, record, {
      headers: new HttpHeaders().set('X-Requested-With', 'XMLHttpRequest')
    })
    .pipe(
      tap(response => console.log(response)),
      catchError((err: any) => {
        return throwError(`Fail on update product!`);    //Rethrow it back to component
      })
    );
  }


  public createProduct(record): Observable<Product> {
    console.log('CREATE: ', record);
    return this.http.post<Product>(`${environment.apiUrl + '/products'}`, record, {
      headers: new HttpHeaders().set('X-Requested-With', 'XMLHttpRequest')
    })
    .pipe(
      tap(response => console.log(response)),
      catchError((err: any) => {
        return throwError(`Fail on create product!`);    //Rethrow it back to component
      })
    );
  }
}
