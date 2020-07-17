import { AppConfigService } from './../../../core/services/app-config.service';
import { FormGroup } from '@angular/forms';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'filter-action-buttons',
  templateUrl: './filter-action-buttons.component.html',
  styleUrls: ['./filter-action-buttons.component.css']
})
export class FilterActionButtonsComponent implements OnInit {

  @Input('form') form: FormGroup;
  @Input('dataTable') dataTable: any;
  @Input('filter') filter: any;

  constructor(public appConfig: AppConfigService) { }

  ngOnInit(): void {
  }

}
