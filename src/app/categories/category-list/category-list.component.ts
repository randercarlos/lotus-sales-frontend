import { TranslateService } from '@ngx-translate/core';
import { NotificationService } from './../../core/services/notification.service';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Category } from './../category.model';
import { AppConfigService } from '../../core/services/app-config.service';
import { TableColumns } from '../../core/interfaces/table-columns.interface';
import { FormBuilder } from '@angular/forms';
import { ConfirmationService, LazyLoadEvent } from 'primeng/api';
import { CategoryService } from '../category.service';
import * as jsPDF from "jspdf";
import "jspdf-autotable";

@Component({
  selector: "app-category-list",
  templateUrl: "./category-list.component.html",
  styleUrls: ["./category-list.component.css"],
  providers: [ConfirmationService]
})
export class CategoryListComponent implements OnInit {

  categories: Category[];
  tableColumns: TableColumns[];
  totalRecords: number;
  tableLoading: boolean = true;

  categoryFilterForm = this.fb.group({
    id: [''],
    name: [''],
    description: ['']
  });

  constructor(
    public appConfig: AppConfigService,
    private confirmationService: ConfirmationService,
    public notificationService: NotificationService,
    private fb: FormBuilder,
    private translateService: TranslateService,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {


    this.tableColumns = [
      { field: "id", header: "global.id", width: "70px", sort: true, align: "center" },
      { field: "name", header: "global.name", width: "30%", sort: true },
      { field: "description", header: "global.description", sort: true },
      { field: "actions", header: "global.actions", width: "110px", sort: false, align: "center" },
    ];

    this.loadCategories();
  }

  loadCategories(event?: LazyLoadEvent, filters?: object): void {

    this.tableLoading = true;
    this.categoryService
      .loadByFilters(event, filters ? filters : this.categoryFilterForm.value)
      .subscribe(resp => {
        this.categories = resp.body['data'];
        this.totalRecords = resp.body['total'];
        this.tableLoading = false;
      });

  }

  public filter(): void {
    this.loadCategories(null, this.categoryFilterForm.value);
  }


  confirm(record): void {
    this.confirmationService.confirm({
      message: this.translateService.instant('global.confirm_remove_msg',
        { value: this.translateService.instant('categories.the_category').toLowerCase() + ` <b>${name}</b>` }),
      accept: () => {

        this.categoryService.deleteById(record.id).subscribe(data => {

          this.notificationService.notify(this.translateService.instant('global.success_msg'),
            this.translateService.instant('global.successfull_remove_msg',
            { value: this.translateService.instant('categories.the_category') + ` <b>${record.name}</b>` }))

            this.loadCategories();
          });
      }
    });
  }
}
