import { Component, OnInit, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AppConfigService } from './../../../core/services/app-config.service';

@Component({
  selector: 'datatable-action-buttons',
  templateUrl: './datatable-action-buttons.component.html',
  styleUrls: ['./datatable-action-buttons.component.css']
})
export class DatatableActionButtonsComponent implements OnInit {

  @Input('record') record: any;
  @Input('confirm') confirm: any;

  constructor(private translateService: TranslateService) { }

  ngOnInit(): void {
  }

}
