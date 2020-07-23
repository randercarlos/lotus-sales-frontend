import { TopProductsComponent } from './top-products/top-products.component';
import { SalesPeriodComponent } from './sales-period/sales-period.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  {
    path: 'sales_period', pathMatch: 'full', component: SalesPeriodComponent, data: { breadcrumb: 'menu.reports.sales_period' },
  },
  {
    path: 'top_products', pathMatch: 'full', component: TopProductsComponent, data: { breadcrumb: 'menu.reports.top_products' },
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule { }
