import { AbstractControl, FormGroup, FormArray } from '@angular/forms';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {

  constructor() { }

  public hasError(control: AbstractControl): boolean {
    return control.invalid && (control.dirty || control.touched);
  }

  public getAllFormErrors(form: FormGroup | FormArray): { [key: string]: any; } | null {
    let hasError = false;
    const result = Object.keys(form.controls).reduce((acc, key) => {
      const control = form.get(key);
      const errors = (control instanceof FormGroup || control instanceof FormArray)
          ? this.getAllFormErrors(control)
          : control.errors;
      if (errors) {
          acc[key] = errors;
          hasError = true;
      }
      return acc;
    }, {} as { [key: string]: any; });
    return hasError ? result : null;
  }
}
