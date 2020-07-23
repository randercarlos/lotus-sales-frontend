import { SharedModule } from './../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportsRoutingModule } from './reports-routing.module';
import { SalesPeriodComponent } from './sales-period/sales-period.component';
import { TopProductsComponent } from './top-products/top-products.component';


@NgModule({
  declarations: [
    SalesPeriodComponent,
    TopProductsComponent
  ],
  imports: [
    SharedModule,
    ReportsRoutingModule
  ]
})
export class ReportsModule { }
