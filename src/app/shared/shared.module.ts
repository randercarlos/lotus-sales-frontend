import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CoreModule } from './../core/core.module';
import { TableModule } from 'primeng/table';
import { LightboxModule } from 'primeng/lightbox';
import { DialogModule } from 'primeng/dialog';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { KeyFilterModule } from 'primeng/keyfilter';
import { FileUploadModule } from 'primeng/fileupload';
import { HttpClientModule } from '@angular/common/http';
import { BlockUIModule } from 'primeng/blockui';
import { CurrencyMaskModule } from "ng2-currency-mask";

import { HeaderComponent } from './__template/header/header.component';
import { FooterComponent } from './__template/footer/footer.component';
import { MenuComponent } from './__template/menu/menu.component';
import { ContentComponent } from './__template/content/content.component';
import { BreadcrumbComponent } from './__template/content/breadcrumb/breadcrumb.component';
import { FieldErrorsComponent } from './components/field-errors/field-errors.component';
import { FormActionButtonsComponent } from './components/form-action-buttons/form-action-buttons.component';
import { FilterActionButtonsComponent } from './components/filter-action-buttons/filter-action-buttons.component';
import { DatatableActionButtonsComponent } from './components/datatable-action-buttons/datatable-action-buttons.component';
import { DatatableReportNewButtonsComponent } from './components/datatable-report-new-buttons/datatable-report-new-buttons.component';


@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    MenuComponent,
    ContentComponent,
    BreadcrumbComponent,
    FieldErrorsComponent,
    FormActionButtonsComponent,
    FilterActionButtonsComponent,
    DatatableActionButtonsComponent,
    DatatableReportNewButtonsComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,

    CoreModule,

    TableModule,
    LightboxModule,
    DialogModule,
    TooltipModule,
    ConfirmDialogModule,
    KeyFilterModule,
    FileUploadModule,
    HttpClientModule,
    BlockUIModule,
    CurrencyMaskModule
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    MenuComponent,
    ContentComponent,
    BreadcrumbComponent,
    FieldErrorsComponent,
    FormActionButtonsComponent,
    FilterActionButtonsComponent,
    DatatableActionButtonsComponent,
    DatatableReportNewButtonsComponent,

    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    CoreModule,

    TableModule,
    LightboxModule,
    DialogModule,
    TooltipModule,
    ConfirmDialogModule,
    KeyFilterModule,
    FileUploadModule,
    HttpClientModule,
    BlockUIModule,
    CurrencyMaskModule
  ]
})
export class SharedModule { }
