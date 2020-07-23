import { NgModule } from '@angular/core';
import { ReportsModule } from './reports/reports.module';
import { ProductsModule } from './products/products.module';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Injectable, LOCALE_ID, DEFAULT_CURRENCY_CODE } from '@angular/core';
import localePt from '@angular/common/locales/pt';
import { registerLocaleData } from '@angular/common';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { GlobalErrorHandlerInterceptor } from './core/interceptors/global-error-handler.interceptor';
import * as Sentry from '@sentry/browser';
import { ErrorHandler } from '@angular/core';


import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './shared/shared.module';
import { CoreModule } from './core/core.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { CategoriesModule } from './categories/categories.module';
import { NgProgressModule } from 'ngx-progressbar';
import { NgProgressHttpModule } from "ngx-progressbar/http";
import { OrdersModule } from './orders/orders.module';

// Register the localization
registerLocaleData(localePt, 'pt-BR');


// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}


// Sentry.init({
//   // dsn: "https://94c777b13fb140109f9d3acfd9bbc439@o404699.ingest.sentry.io/5281573",
//   integrations: [new Sentry.Integrations.TryCatch({
//     XMLHttpRequest: false,
//   })],
// });

// @Injectable()
// export class SentryErrorHandler implements ErrorHandler {
//   constructor() {}
//   handleError(error) {
//     Sentry.captureException(error.originalError || error);
//     throw error;
//   }
// }


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    SharedModule,
    CoreModule,
    DashboardModule,
    CategoriesModule,
    ProductsModule,
    OrdersModule,
    ReportsModule,
    NgProgressModule.withConfig({ // enable the spinner on every request in application
      color: 'white'
    }),
    NgProgressHttpModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      },
    }),
  ],
  providers: [
    {
      provide: LOCALE_ID,
      useValue: 'pt-BR'
    },
    {
      provide: DEFAULT_CURRENCY_CODE,
      useValue: 'BRL'
    },
   // { provide: ErrorHandler, useClass: SentryErrorHandler }, // enable error capture by Sentry
    {
      provide: HTTP_INTERCEPTORS,
      useClass: GlobalErrorHandlerInterceptor,  // enable GlobalErrorHandlerInterceptor
      multi: true
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
