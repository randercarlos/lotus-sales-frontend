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

  @ViewChild("dialogImgCont") dialogImgCont: any;
  @ViewChild("dialogImgSrc") dialogImgSrc: ElementRef<any>;

  displayImage: boolean = false;
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

    this.loadCategories();

    this.tableColumns = [
      { field: "id", header: "global.id", width: "6%", sort: true },
      { field: "name", header: "global.name", width: "30%", sort: true },
      { field: "description", header: "global.description", sort: true },
      { field: "image", header: "global.image", width: "7%", sort: false, align: "center" },
      { field: "actions", header: "global.actions", width: "8%", sort: false, align: "center" },
    ];
  }

  loadCategories(event?: LazyLoadEvent, filters?: object): void {

    this.tableLoading = true;
    this.categoryService
      .loadByFilters(event, filters ? filters : this.categoryFilterForm.value)
      .subscribe(resp => {
        this.categories = resp.body;
        this.totalRecords = Number(resp.headers.get('x-total-count'));
        this.tableLoading = false;
      });

    //in a real application, make a remote request to load data using state metadata from event
    //event.first = First row offset
    //event.rows = Number of rows per page
    //event.sortField = Field name to sort with
    //event.sortOrder = Sort order as number, 1 for asc and -1 for dec
    //filters: FilterMetadata object having field as key and filter value, filter matchMode as value
  }

  public filter(): void {
    this.loadCategories(null, this.categoryFilterForm.value);
  }

  public showModal(title: string, imgSrc: string): void {
    this.dialogImgCont.header = title;
    this.dialogImgSrc.nativeElement.src = imgSrc;
    this.dialogImgSrc.nativeElement.title = title;
    this.displayImage = true;
  }

  exportPDF(): void {

    const pdf = new jsPDF({ orientation: this.appConfig.orientation });
    pdf.setProperties({
      title: this.translateService.instant('global.report_title', {
        value: this.translateService.instant('categories.itself')
      })
    });
    pdf.autoTable({
      head: [this.tableColumns.map(data => this.translateService.instant(data.header)).slice(0, 3)],
      body: this.categories
        .map((data) => [
          data['id'],
          data['name'],
          data['description'],
        ])
    });
    window.open(pdf.output("bloburl"));
  }

  confirm(name: string): void {
    this.confirmationService.confirm({
      message: this.translateService.instant('global.confirm_remove_msg',
        { value: this.translateService.instant('categories.the_category').toLowerCase() + ` <b>${name}</b>` }),
      accept: () => {
        this.notificationService.notify(this.translateService.instant('global.success_msg'),
          this.translateService.instant('global.successfull_remove_msg',
          { value: this.translateService.instant('categories.the_category') + ` <b>${name}</b>` }))
      }
    });
  }
}
