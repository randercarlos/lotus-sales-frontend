import { ReportService } from './../report.service';
import { CategoryService } from './../../categories/category.service';
import { TranslateService } from '@ngx-translate/core';
import { NotificationService } from './../../core/services/notification.service';
import { ConfirmationService, LazyLoadEvent } from 'primeng/api';
import { AppConfigService } from './../../core/services/app-config.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import * as jsPDF from "jspdf";
import "jspdf-autotable";

@Component({
  selector: 'app-sales-period',
  templateUrl: './sales-period.component.html',
  styleUrls: ['./sales-period.component.css'],
  providers: [ConfirmationService]
})
export class SalesPeriodComponent implements OnInit {

  totalRecords: number;
  tableLoading: boolean = true;
  revenue: number = 0;
  profit: number = 0;

  salesPeriodForm = this.fb.group({
    periodFrom: [''],
    periodTo: [''],
  });

  constructor(
    public appConfig: AppConfigService,
    public notificationService: NotificationService,
    private fb: FormBuilder,
    private reportService: ReportService
  ) {}

  ngOnInit(): void {

  }

  generateReport(): void {
    const periodFrom = this.salesPeriodForm.get('periodFrom').value;
    const periodTo = this.salesPeriodForm.get('periodTo').value;

    this.reportService.salesPeriod(periodFrom, periodTo).subscribe(data => {
      this.revenue = data['revenue'];
      this.profit = data['profit'];
    });
  }

}
