import { throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Injectable, Injector } from '@angular/core';
import { environment } from './../../environments/environment';
import { BaseCrudService } from '../core/services/base-crud.service';
import { Observable } from 'rxjs';
import { HttpHeaders, HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ReportService  {

  constructor(private http: HttpClient) {
  }

  salesPeriod(periodFrom = null, periodTo = null): Observable<any[]> {

    let url = environment.apiUrl + '/reports/sales_period';
    let querystring = [];

    if (periodFrom) {
      querystring.push('from=' + periodFrom);
    }

    if (periodTo) {
      querystring.push('to=' + periodTo);
    }

    if (querystring.length > 1) {
      url = url + '?' + querystring.join('&');
    }
    return this.http.get<any[]>(url)
    .pipe(
      catchError((err: any) => {
        return throwError(`Fail on load sales periodo report!`);    //Rethrow it back to component
      })
    );
  }


  top10ProductSales(typeReport = 1): Observable<any[]> {

    let url = environment.apiUrl + '/reports/top10_product_sales';

    if (typeReport) {
      url = url + '?' + 'type=' + typeReport;
    }

    return this.http.get<any[]>(url)
    .pipe(
      catchError((err: any) => {
        return throwError(`Fail on load sales periodo report!`);    //Rethrow it back to component
      })
    );
  }
}
