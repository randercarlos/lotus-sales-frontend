import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NotificationService } from './../../core/services/notification.service';
import { Product } from './../product.model';
import { AppConfigService } from '../../core/services/app-config.service';
import { TableColumns } from '../../core/interfaces/table-columns.interface';
import { FormBuilder } from '@angular/forms';
import { ConfirmationService, LazyLoadEvent } from 'primeng/api';
import { ProductService } from '../product.service';
import * as jsPDF from "jspdf";
import "jspdf-autotable";

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
  providers: [ConfirmationService]
})
export class ProductListComponent implements OnInit {

  @ViewChild("dialogImgCont") dialogImgCont: any;
  @ViewChild("dialogImgSrc") dialogImgSrc: ElementRef<any>;

  displayImage: boolean = false;
  products: Product[];
  tableColumns: TableColumns[];
  totalRecords: number;
  tableLoading: boolean = true;

  productFilterForm = this.fb.group({
    id: [''],
    name: [''],
    category: [''],
    costPrice_lower: [''],
    costPrice_greather: [''],
    salePrice_lower: [''],
    salePrice_greather: [''],
    unitsStock_lower: [''],
    unitsStock_greather: [''],
    active: [''],
  });

  constructor(
    public appConfig: AppConfigService,
    private confirmationService: ConfirmationService,
    public notificationService: NotificationService,
    private fb: FormBuilder,
    private translateService: TranslateService,
    private productService: ProductService
  ) {}

  ngOnInit(): void {

    this.loadProducts();

    this.tableColumns = [
      { field: "id", header: "global.id", width: "70px", sort: true, align: "center"},
      { field: "photo", header: "global.image", width: "90px", sort: false, align: "center" },
      { field: "name", header: "global.name", sort: true },
      { field: "category", header: "categories.itself", width: "250px", sort: true },
      { field: "costPrice", header: "global.cost_price", width: "100px", sort: true, align: "center",  },
      { field: "salePrice", header: "global.sale_price", width: "100px", sort: true, align: "center", },
      { field: "unitsStock", header: "global.units_stock", width: "80px", sort: true, align: "center" },
      { field: "active", header: "global.active", width: "80px", sort: false, align: "center" },
      { field: "actions", header: "global.actions", width: "110px", sort: false, align: "center" },
    ];
  }

  loadProducts(event?: LazyLoadEvent, filters?: object): void {

    this.tableLoading = true;
    this.productService
      .loadByFilters(event, filters ? filters : this.productFilterForm.value)
      .subscribe(resp => {
        this.products = resp.body;
        this.totalRecords = Number(resp.headers.get('x-total-count'));
        this.tableLoading = false;
      });

  }

  public filter(): void {
    this.loadProducts(null, this.productFilterForm.value);
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
        value: this.translateService.instant('products.itself')
      })
    });
    pdf.autoTable({
      head: [this.tableColumns.map(data => this.translateService.instant(data.header)).slice(0, 3)],
      body: this.products
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
        { value: this.translateService.instant('products.the_product').toLowerCase() + ` <b>${name}</b>` }),
      accept: () => {
        this.notificationService.notify(this.translateService.instant('global.success_msg'),
          this.translateService.instant('global.successfull_remove_msg',
          { value: this.translateService.instant('products.the_product') + ` <b>${name}</b>` }))
      }
    });
  }
}
