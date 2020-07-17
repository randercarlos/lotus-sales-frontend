import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FORM_MODE } from '../core/enums/form-mode.enum';
import { ProductListComponent } from './product-list/product-list.component';
import { ProductFormComponent } from './product-form/product-form.component';


const routes: Routes = [
  {
    path: 'products', data: { breadcrumb: 'products.itself' }, children: [
      { path: '',  pathMatch: 'full', component: ProductListComponent },
      { path: 'create',  pathMatch: 'full', component: ProductFormComponent, data: { breadcrumb: 'global.new',
        formMode: FORM_MODE.Create } },
      { path: 'edit/:id',  pathMatch: 'full', component: ProductFormComponent, data: { breadcrumb: 'global.edit',
        formMode: FORM_MODE.Edit } },
      { path: 'view/:id',  pathMatch: 'full', component: ProductFormComponent, data: { breadcrumb: 'global.view',
        formMode: FORM_MODE.View } },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductsRoutingModule { }
