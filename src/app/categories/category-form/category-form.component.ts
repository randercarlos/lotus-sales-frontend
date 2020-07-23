import { CategoryService } from './../category.service';
import { NotificationService } from './../../core/services/notification.service';
import { AppConfigService } from './../../core/services/app-config.service';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService } from 'primeng/api';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Category } from './../category.model';
import { ActivatedRoute, Router } from '@angular/router';
import { FORM_MODE } from '../../core/enums/form-mode.enum';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { UploadService } from './../../core/services/upload.service';
import { ValidationService } from './../../core/services/validation.service';
import { NotificationType } from 'src/app/core/enums/notification-type.enum';

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.css'],
  providers: [ConfirmationService]
})
export class CategoryFormComponent implements OnInit {


  formMode: FORM_MODE;                      // store the form mode from route data
  FORM_MODE: typeof FORM_MODE = FORM_MODE;  // allow to use the enum FORM_MODE in template
  category: Category;
  originalCategory: Category;
  categoryForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public appConfig: AppConfigService,
    public uploadService: UploadService,
    public validationService: ValidationService,
    public notificationService: NotificationService,
    private translateService: TranslateService,
    private confirmationService: ConfirmationService,
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private router: Router
    ) { }

  ngOnInit(): void {
    this.loadForm();
  }

  private loadForm(): void {

    this.createForm();

    // get the form mode from route data
    this.route.data.subscribe(data => {
      this.formMode = data.formMode ? data.formMode : FORM_MODE.Create; // default is create/new form

      if (this.formMode === FORM_MODE.View) {
        this.categoryForm.disable();
      }

      if (this.formMode !== FORM_MODE.Create) {
        console.log(this.route.snapshot.params);

        const id_category = Number(this.route.snapshot.params['id']);
        // load the category from DB
        this.loadCategory(id_category);
      }

    });
  }

  private createForm(): void {
    this.categoryForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(60)]],
      description: ['', [Validators.minLength(5), Validators.maxLength(100)]],
    });
  }


  private loadCategory(id: number): void {
    this.categoryService.loadByID(id).subscribe(category => {
      this.category = category;

      // create a clone of the loaded product to restore it when the Cancel button is clicked
      this.originalCategory = category;
      this.populateForm();
    });
  }

  private populateForm(): void {
    this.categoryForm.patchValue( this.category );
  }

  cancel(): void {
    this.confirmationService.confirm({ message: this.translateService.instant('global.confirm_cancel_msg'),
      accept: () => {

        this.categoryForm.reset();
        if (this.formMode === FORM_MODE.Edit) {
          this.category = { ...this.originalCategory };
          this.populateForm();
        }

      }
    });

  }

  save(): void {
    const data = this.categoryForm.value;
    if (this.route.snapshot.paramMap.get('id')) {
      data.id = +this.route.snapshot.paramMap.get('id');
    }

    this.categoryService.save(data).subscribe(response => {
      this.router.navigateByUrl('/categories');

      this.notificationService.notify(this.translateService.instant('global.success_msg'),
        this.translateService.instant('categories.successfull_save_msg', { value: this.categoryForm.get('name').value }), NotificationType.Success);
    });
  }
}
