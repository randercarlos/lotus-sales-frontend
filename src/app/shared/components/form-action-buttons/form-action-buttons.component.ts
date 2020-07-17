import { AppConfigService } from './../../../core/services/app-config.service';
import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'form-action-buttons',
  templateUrl: './form-action-buttons.component.html',
  styleUrls: ['./form-action-buttons.component.css']
})
export class FormActionButtonsComponent implements OnInit {

  @Input('form') form: FormGroup;
  @Input('goBackRoute') goBackRoute: string;
  @Input('cancel') cancel: any;

  constructor(public appConfig: AppConfigService) { }

  ngOnInit(): void {
  }

}
