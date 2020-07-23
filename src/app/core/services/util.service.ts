import { AbstractControl, FormGroup, FormArray } from '@angular/forms';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  constructor() { }

  public copyObj(obj: any): any {
    return JSON.parse(JSON.stringify(obj));
  }

}
