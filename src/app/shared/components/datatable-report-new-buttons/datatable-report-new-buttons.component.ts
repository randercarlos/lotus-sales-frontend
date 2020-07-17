import { Component, OnInit, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AppConfigService } from '../../../core/services/app-config.service';

@Component({
  selector: 'datatable-report-new-buttons',
  templateUrl: './datatable-report-new-buttons.component.html',
  styleUrls: ['./datatable-report-new-buttons.component.css']
})
export class DatatableReportNewButtonsComponent implements OnInit {

  @Input('dataTable') dataTable: any;
  @Input('exportPDF') exportPDF: any;
  @Input('create_route') create_route: string;
  @Input('create_button_key') create_button_key: string;

  constructor(public appConfig: AppConfigService, private translateService: TranslateService) { }

  ngOnInit(): void {
  }

}
