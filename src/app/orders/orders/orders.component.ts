import { OrderService } from './../order.service';
import { UtilService } from './../../core/services/util.service';
import { Order } from './../order.model';
import { OrderDetail } from './../order-detail.model';
import { ConfirmationService, LazyLoadEvent } from 'primeng/api';
import { ProductService } from './../../products/product.service';
import { TranslateService } from '@ngx-translate/core';
import { NotificationService } from './../../core/services/notification.service';
import { AppConfigService } from './../../core/services/app-config.service';
import { Product } from './../../products/product.model';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { TableColumns } from 'src/app/core/interfaces/table-columns.interface';
import { FormBuilder } from '@angular/forms';
import * as jsPDF from "jspdf";
import "jspdf-autotable";
import { Observable } from 'rxjs';
import { Category } from 'src/app/categories/category.model';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css'],
  providers: [ConfirmationService, CurrencyPipe]
})
export class OrdersComponent implements OnInit {

  products: Observable<Product[]>;
  tableColumns: TableColumns[];
  totalRecords: number;
  tableLoading: boolean = true;
  orders: Order[] = [];
  orderDetails: OrderDetail[] = [];
  selectedDetail: OrderDetail;
  selectedProduct: Product;


  orderDetailForm = this.fb.group({
    product: [''],
    unit_price: [''],
    qtd: [''],
  });

  constructor(
    public appConfig: AppConfigService,
    private confirmationService: ConfirmationService,
    public notificationService: NotificationService,
    private fb: FormBuilder,
    private translateService: TranslateService,
    private productService: ProductService,
    private utilService: UtilService,
    private currencyPipe: CurrencyPipe,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {

    this.tableColumns = [
      { field: "id", header: "global.id", width: "90px", sort: true, align: "center"},
      { field: "summary", header: "global.summary", sort: false },
      { field: "order_date", header: "global.date", width: "180px", sort: true, align: "center" },
      { field: "status", header: "global.status", width: "120px", sort: false, align: "center" },
    ];


    this.loadProducts();
    this.loadOrders();
  }

  removeSelectedDetail(): void {
    this.confirmationService.confirm({
      message: this.translateService.instant('menu.orders.confirm_remove_selected'), accept: () => {
        this.orderDetails = this.orderDetails.filter(item => item.id !== this.selectedDetail.id)

        this.notificationService.notify(this.translateService.instant('global.success_msg'),
        this.translateService.instant('products.successfull_remove_msg', {
          value: this.translateService.instant('products.it') + ` <b>${this.selectedDetail.product.name}</b>` }));
        }
    });
  }

  getTotalOrderDetails(): number {
    let total = 0;
    this.orderDetails.forEach(orderDetail => {
      total += orderDetail.qtd * orderDetail.unit_price;
    });

    return total;
  }

  makeSummaryFromOrder(id_order: number): string {

    let total = 0;
    let totalQtd = 0;

    const order = this.orders.find(order => order.id === id_order);
    if (order && order['order_details'].length > 0) {
      order['order_details'].forEach(orderDetail => {
        total += orderDetail.qtd * orderDetail.unit_price;
        totalQtd += orderDetail.qtd;
      });
    }

    return `${totalQtd} Produtos - Total: ${this.currencyPipe.transform(total, 'BRL', 'R$ ', '1.2-2')}`;
  }

  addProduct(): void {

    // if products exists in listing, only increase the product's quantity
    if (this.existsProductInOrderDetails()) {
      this.orderDetails.map(orderDetail => {
        if (orderDetail.product.id === this.selectedProduct.id) {
          orderDetail.qtd += Number(this.orderDetailForm.get('qtd').value);
        }
      });
    } else {  // if products not exists in listing, add the product in listing

      const orderDetail: OrderDetail = {
        id: this.orderDetails.length + 1,
        product: this.utilService.copyObj(this.selectedProduct),
        unit_price: +this.selectedProduct.sale_price,
        qtd: Number(this.orderDetailForm.get('qtd').value)
      };

      this.orderDetails.push(orderDetail);
    }


    this.notificationService.notify(this.translateService.instant('global.success_msg'),
      this.translateService.instant('products.successfull_add_msg',
      { value: this.translateService.instant('products.it') + ` <b>${this.selectedProduct.name}</b>` }));

    // clear the form
    this.clearOrderDetailForm();
  }

  makeSale(): void {
    const order: Order = {
      order_date: new Date(),
      order_details: this.utilService.copyObj(this.orderDetails),
    };

    this.orderService.makeSale(order).subscribe(data => {

       // clear the form
      this.clearOrderDetailForm();

      // clear the order detail list
      this.orderDetails = [];

      this.notificationService.notify(this.translateService.instant('global.success_msg'),
          this.translateService.instant('menu.orders.successfull_save_msg'));

      this.loadOrders();
    })

  }

  private existsProductInOrderDetails(): boolean {
    if (this.orderDetails.length === 0) {
      return false;
    }

    return this.orderDetails.find(orderDetail => orderDetail.product.id === this.selectedProduct.id) ? true: false;
  }


  cancel(): void {
    this.confirmationService.confirm({
      message: this.translateService.instant('menu.orders.cancel_selected'), accept: () => {
        this.clearOrderDetailForm();
        this.orderDetails = [];
      }
    });
  }

  private clearOrderDetailForm(): void {
    this.selectedProduct = null;
    this.orderDetailForm.reset();
    this.orderDetailForm.get('product').setValue('');
    this.orderDetailForm.get('qtd').setValue(0);
  }

  onChange(): void {
    this.selectedProduct = this.orderDetailForm.get('product').value;
    console.log(this.orderDetailForm.get('product').value);
  }

  loadProducts(): void {
    this.products = this.productService.loadAllOrderedByName();
  }

  loadOrders(event?: LazyLoadEvent, filters?: object): void {

    this.tableLoading = true;
    this.orderService
      .loadByFilters(event, filters ? filters : null)
      .subscribe(resp => {
        console.log(resp.body);
        this.orders = resp.body['data'];
        this.totalRecords = resp.body['total'];
        this.tableLoading = false;
      });
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
