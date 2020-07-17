import { LazyLoadEvent } from 'primeng/api';
import { Injector } from '@angular/core';
import { AppConfigService } from './app-config.service';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { delay, tap, take, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { NotificationService } from './notification.service';
import { TranslateService } from '@ngx-translate/core';

export class BaseCrudService<T> {

  http: HttpClient;
  appConfig: AppConfigService;
  notificationService: NotificationService;
  translateService: TranslateService;

  constructor(private API_URL: string, private injectorObj: Injector, private className: string) {
    this.http = this.injectorObj.get(HttpClient);
    this.appConfig = this.injectorObj.get(AppConfigService);
    this.notificationService = this.injectorObj.get(NotificationService);
    this.translateService = this.injectorObj.get(TranslateService);
  }

  loadByFilters(event?: LazyLoadEvent, filters?: object): Observable<HttpResponse<T[]>> {
    const params = this.buildQueryString(event, filters);

    return this.http.get<T[]>(this.API_URL, { params, observe: 'response' })
      .pipe(
        catchError((err: any) => {
          return throwError(`Fail on filter ${this.className}!`);    //Rethrow it back to component
        })
      )
  }


  loadAll(): Observable<T[]> {
    return this.http.get<T[]>(this.API_URL)
    .pipe(
      catchError((err: any) => {
        return throwError(`Fail on list ${this.className}!`);    //Rethrow it back to component
      })
    );
  }

  loadByID(id: number): Observable<T> {
    return this.http.get<T>(`${this.API_URL}/${id}`).pipe(take(1))
    .pipe(
      catchError((err: any) => {
        return throwError(`Fail on load ${this.className} by ID ${id}!`);    //Rethrow it back to component
      })
    );
  }

  private create(record: T): Observable<T> {
    return this.http.post<T>(this.API_URL, record).pipe(take(1))
    .pipe(
      catchError((err: any) => {
        return throwError(`Fail on create ${this.className}!`);    //Rethrow it back to component
      })
    );
  }

  private update(record: T): Observable<T> {
    return this.http.put<T>(`${this.API_URL}/${record['id']}`, record)
    .pipe(
      take(1),
      catchError((err: any) => {
        return throwError(`Fail on update ${this.className}!`);    //Rethrow it back to component
      })
    );
  }

  save(record: T): Observable<T> {
    if (record['id']) {
      return this.update(record);
    }
    return this.create(record);
  }

  deleteById(id): Observable<T> {
    return this.http.delete<T>(`${this.API_URL}/${id}`).pipe(take(1))
    .pipe(
      take(1),
      catchError((err: any) => {
        return throwError(`Fail on delete ${this.className} by ID ${id}!`);    //Rethrow it back to component
      })
    );
  }



  private buildQueryString(event?: LazyLoadEvent, filters?: object): HttpParams {

    const firstRowOffset = event && event['first'] ? event['first'] : 0;
    const rowsPerPage = event && event['rows'] ? event['rows'] : this.appConfig.rows; // get the rows number per page
    const page = Math.floor(firstRowOffset / rowsPerPage) + 1;  // calculate the current page

    let params = new HttpParams()
      .set('_limit', rowsPerPage.toString())
      .set('_page', page.toString());

    if (event && event.sortField) {
      params = params.set('_sort', event.sortField).set('_order', event.sortOrder == 1 ? 'asc' : 'desc');
    }

    if (filters) {
      for (const f in filters) {
        let field = f;
        const value = filters[field];

        if (value) {
          if (field === 'name' || field === 'description') {
            field = field + '_like';
          }
          params = params.set(field, value);
        }
      }
    }

    // console.log('params', params.toString());

    return params;
  }
}
