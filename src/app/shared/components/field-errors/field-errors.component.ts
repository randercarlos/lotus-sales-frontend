import { TranslateValidationValue } from './translate-validation-value';
import { Component, OnInit, Input, ViewChild, ElementRef, AfterViewInit, AfterViewChecked } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'field-errors',
  templateUrl: './field-errors.component.html',
  styleUrls: ['./field-errors.component.css']
})
export class FieldErrorsComponent implements OnInit {

  @Input("fieldControl") fieldControl: FormControl;
  @Input("transValue") transValue: TranslateValidationValue;

  constructor() { }

  ngOnInit(): void {
  }

}
