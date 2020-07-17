import { environment } from './../../../environments/environment.prod';
import { AppConfigService } from './../services/app-config.service';
import { Router } from '@angular/router';
import { Injectable } from "@angular/core";
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from "rxjs";
import { catchError, map, retry } from 'rxjs/operators';

import { NotificationService } from './../services/notification.service';
import { NotificationType } from '../enums/notification-type.enum';
import { TranslateService } from '@ngx-translate/core';
@Injectable()
export class GlobalErrorHandlerInterceptor implements HttpInterceptor {

  constructor(
    private router: Router,
    private notificationService: NotificationService,
    private translateService: TranslateService,
    private appConfigService: AppConfigService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    return next.handle(req)
    .pipe(
      retry(this.appConfigService.retry),
      catchError((error) => {
        let errorMessage = '';

       if (error instanceof HttpErrorResponse) {

        if (!navigator.onLine) {
          errorMessage = `${this.translateService.instant('global.error_no_network')}`;
        } else if (error.status === 0) {
          errorMessage = this.translateService.instant('global.error_no_server');
        } else if (error.status === 500) {
          errorMessage = this.translateService.instant('global.error_server');
        } else {
          errorMessage = this.translateService.instant('global.error_generic');
        }
        //   case 403:
        //     // error Token Invalid and Redirect to logout
        //     break;
        //   case 401:
        //     // error Token Invalid and Redirect to logout
        //     break;
        //   case 502:    if (error.error.status === 500)
        //     // Bad gateway error
        //     break;
        } else {

          errorMessage = this.translateService.instant('global.error_generic');

        }

        var styles = [
          'background: linear-gradient(#D33106, #571402)'
          , 'border: 1px solid #3E0E02'
          , 'color: white'
          , 'display: block'
          , 'line-height: 40px'
          , 'text-align: center'
          , 'font-weight: bold'
        ].join(';');


        if (!environment.production) {
          console.log(`%cGlobal Error Handler - Type: ${error.name} - Error Status: ${error.status} ` +
            `- Body: ${error.message}\nStack Trace: ${error.stack}`, styles);
        }


        this.notificationService.notify(this.translateService.instant('global.error_msg'),
          errorMessage, NotificationType.Error, 'bottom center', 10000);

        return throwError(errorMessage);
      })
    )
  }
}
