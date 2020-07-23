import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FORM_MODE } from '../core/enums/form-mode.enum';
import { OrdersComponent } from './orders/orders.component';


const routes: Routes = [
  {
    path: 'orders', pathMatch: 'full', component: OrdersComponent, data: { breadcrumb: 'menu.orders.itself' }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrdersRoutingModule { }
