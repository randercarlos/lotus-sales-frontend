import { DashboardComponent } from './dashboard.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  { path: 'dashboard', pathMatch: 'full', component: DashboardComponent, data: { breadcrumb: 'menu.dashboard' }}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
