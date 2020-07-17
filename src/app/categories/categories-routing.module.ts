import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CategoryListComponent } from './category-list/category-list.component';
import { CategoryFormComponent } from './category-form/category-form.component';
import { FORM_MODE } from '../core/enums/form-mode.enum';


const routes: Routes = [
  { path: 'categories', data: { breadcrumb: 'categories.itself' }, children: [
      { path: '',  pathMatch: 'full', component: CategoryListComponent },
      { path: 'create',  pathMatch: 'full', component: CategoryFormComponent, data: { breadcrumb: 'global.new',
        formMode: FORM_MODE.Create } },
      { path: 'edit/:id',  pathMatch: 'full', component: CategoryFormComponent, data: { breadcrumb: 'global.edit',
        formMode: FORM_MODE.Edit } },
      { path: 'view/:id',  pathMatch: 'full', component: CategoryFormComponent, data: { breadcrumb: 'global.view',
        formMode: FORM_MODE.View } },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CategoriesRoutingModule { }
