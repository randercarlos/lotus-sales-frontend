import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Injectable, Injector } from '@angular/core';
import { environment } from './../../environments/environment';
import { Category } from './category.model';
import { BaseCrudService } from '../core/services/base-crud.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService extends BaseCrudService<Category> {

  constructor(private injector: Injector) {
    super(environment.apiUrl + '/categories', injector, 'categories');
  }

  loadAllOrderedByName(): Observable<Category[]> {
    return this.http.get<Category[]>(environment.apiUrl + '/categories')
    .pipe(
      map(categories => {
        categories.sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));

        return categories;
      }),
      catchError((err: any) => {
        return throwError(`Fail on load categories ordered by name!`);    //Rethrow it back to component
      })
    );
  }
}
