import { Product } from './product.model';
import { Injectable, Injector } from '@angular/core';
import { BaseCrudService } from '../core/services/base-crud.service';
import { environment } from './../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService extends BaseCrudService<Product> {

  constructor(private injector: Injector) {
    super(environment.apiUrl + '/products', injector, 'products');
  }

  // getCategories(): Observable<Category[]> {
  //   return this.http.get<Category[]>(this.API_URL)
  //     .pipe(
  //       tap(p => console.log(p)),
  //     );
  // }
}
