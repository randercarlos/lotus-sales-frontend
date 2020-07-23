import { ReportService } from './../report.service';
import { ProductService } from './../../products/product.service';
import { Product } from './../../products/product.model';
import { Component, OnInit } from '@angular/core';
import { CategoryService } from './../../categories/category.service';
import { TranslateService } from '@ngx-translate/core';
import { NotificationService } from './../../core/services/notification.service';
import { ConfirmationService, LazyLoadEvent } from 'primeng/api';
import { AppConfigService } from './../../core/services/app-config.service';
import { FormBuilder, Validators } from '@angular/forms';
import * as jsPDF from "jspdf";
import "jspdf-autotable";
import { TableColumns } from 'src/app/core/interfaces/table-columns.interface';

@Component({
  selector: 'app-top-products',
  templateUrl: './top-products.component.html',
  styleUrls: ['./top-products.component.css'],
  providers: [ConfirmationService]
})
export class TopProductsComponent implements OnInit {

  tableColumns: TableColumns[];
  totalRecords: number;
  tableLoading: boolean = true;
  reportData: any[];
  showTable: boolean = false;

  topProductsForm = this.fb.group({
    typeReport: ['1', Validators.required],
  });

  constructor(
    public appConfig: AppConfigService,
    public notificationService: NotificationService,
    private fb: FormBuilder,
    private translateService: TranslateService,
    private reportService: ReportService
  ) {}

  ngOnInit(): void {

    // this.loadProducts();

    this.tableColumns = [
      { field: "id", header: "global.id", width: "70px", sort: true, align: "center"},
      // { field: "photo", header: "global.image", width: "110px", sort: false, align: "center" },
      { field: "name", header: "global.name", sort: true },
      { field: "category", header: "categories.itself", width: "250px", sort: true },
      { field: "sale_price", header: "global.sale_price", width: "140px", sort: true, align: "center" },
      { field: "order_details_count", header: "menu.orders.sales", width: "120px", sort: true, align: "center" },
    ];


    // this.reportData = [
    //   {
    //     "id": 1,
    //     "name": "Wine - White, Riesling, Semi - Dry",
    //     "category": "Electronics",
    //     "costPrice": 449.61,
    //     "salePrice": 800.2,
    //     "unitsStock": 288,
    //     "active": true,
    //     "sales": 53
    //   }, {
    //     "id": 2,
    //     "name": "French Kiss Vanilla",
    //     "category": "Automotive",
    //     "costPrice": 62.4,
    //     "salePrice": 891.94,
    //     "unitsStock": 915,
    //     "active": true,
    //     "sales": 46
    //   }, {
    //     "id": 3,
    //     "name": "Bacon Strip Precooked",
    //     "category": "Grocery",
    //     "costPrice": 480.37,
    //     "salePrice": 743.28,
    //     "unitsStock": 50,
    //     "active": false,
    //     "sales": 38
    //   }, {
    //     "id": 4,
    //     "name": "Garlic Powder",
    //     "category": "Beauty",
    //     "costPrice": 38.1,
    //     "salePrice": 662.33,
    //     "unitsStock": 862,
    //     "photo": null,
    //     "active": true,
    //     "sales": 26
    //   }, {
    //     "id": 5,
    //     "name": "Sherbet - Raspberry",
    //     "category": "Shoes",
    //     "costPrice": 286.62,
    //     "salePrice": 732.29,
    //     "unitsStock": 154,
    //     "active": true,
    //     "sales": 21
    //   }
    // ];

  }

  loadData(): void {

    this.showTable = true;
    this.tableLoading = true;

    const typeReport = this.topProductsForm.get('typeReport').value;

    this.reportService.top10ProductSales(typeReport).subscribe(data => {
      console.log(data);
      this.reportData = data;
      this.totalRecords = 10;
      this.tableLoading = false;
    });

  }

}
