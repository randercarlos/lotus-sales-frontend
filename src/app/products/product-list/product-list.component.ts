import { CategoryService } from './../../categories/category.service';
import { Category } from './../../categories/category.model';
import { Observable } from 'rxjs';
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
import { DomSanitizer } from '@angular/platform-browser';

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
  categories: Observable<Category[]>;
  tableColumns: TableColumns[];
  totalRecords: number;
  tableLoading: boolean = true;

  productFilterForm = this.fb.group({
    id: [''],
    name: [''],
    category_id: [''],
    'cost_price[lte]': [''],
    'cost_price[gte]': [''],
    'sale_price[lte]': [''],
    'sale_price[gte]': [''],
    'units_stock[lte]': [''],
    'units_stock[gte]': [''],
    active: [''],
  });

  constructor(
    public appConfig: AppConfigService,
    private confirmationService: ConfirmationService,
    public notificationService: NotificationService,
    private fb: FormBuilder,
    private translateService: TranslateService,
    private productService: ProductService,
    private categoryService: CategoryService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {

    this.tableColumns = [
      { field: "id", header: "global.id", width: "70px", sort: true, align: "center"},
      { field: "photo", header: "global.image", width: "110px", sort: false, align: "center" },
      { field: "name", header: "global.name", sort: true },
      { field: "category", header: "categories.itself", width: "250px", sort: true },
      { field: "cost_price", header: "global.cost_price", width: "100px", sort: true, align: "center",  },
      { field: "sale_price", header: "global.sale_price", width: "100px", sort: true, align: "center", },
      { field: "units_stock", header: "global.units_stock", width: "80px", sort: true, align: "center" },
      { field: "active", header: "global.active", width: "80px", sort: false, align: "center" },
      { field: "actions", header: "global.actions", width: "110px", sort: false, align: "center" },
    ];

    this.loadProducts();
    this.loadCategories();
  }

  loadProducts(event?: LazyLoadEvent, filters?: object): void {

    this.tableLoading = true;
    this.productService
      .loadByFilters(event, filters ? filters : this.productFilterForm.value)
      .subscribe(resp => {
        this.products = resp.body['data'];
        this.totalRecords = resp.body['meta']['total'];
        this.tableLoading = false;
      });

  }

  loadCategories(): void {
    this.categories = this.categoryService.loadAllOrderedByName();
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

  confirm(record): void {
    this.confirmationService.confirm({
      message: this.translateService.instant('global.confirm_remove_msg',
        { value: this.translateService.instant('products.the_product').toLowerCase() + ` <b>${name}</b>` }),
      accept: () => {

        this.productService.deleteById(record.id).subscribe(data => {

          this.notificationService.notify(this.translateService.instant('global.success_msg'),
            this.translateService.instant('global.successfull_remove_msg',
            { value: this.translateService.instant('products.the_product') + ` <b>${record.name}</b>` }))

            this.loadProducts();
        });

      }
    });
  }
}
