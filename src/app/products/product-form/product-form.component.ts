import { CategoryService } from './../../categories/category.service';
import { ProductService } from './../product.service';
import { NotificationType } from 'src/app/core/enums/notification-type.enum';
import { ConfirmationService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { NotificationService } from './../../core/services/notification.service';
import { ValidationService } from './../../core/services/validation.service';
import { AppConfigService } from './../../core/services/app-config.service';
import { UploadService } from './../../core/services/upload.service';
import { Product } from './../product.model';
import { FORM_MODE } from 'src/app/core/enums/form-mode.enum';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Category } from 'src/app/categories/category.model';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css'],
  providers: [ConfirmationService]
})
export class ProductFormComponent implements OnInit {

  @ViewChild("imageUpload") imageUpload: ElementRef<any>;

  formMode: FORM_MODE;                      // store the form mode from route data
  FORM_MODE: typeof FORM_MODE = FORM_MODE;  // allow to use the enum FORM_MODE in template
  product: Product;
  originalProduct: Product;
  productForm: FormGroup;
  categories: Observable<Category[]>;

  constructor(
    private fb: FormBuilder,
    public appConfig: AppConfigService,
    public uploadService: UploadService,
    public validationService: ValidationService,
    public notificationService: NotificationService,
    private translateService: TranslateService,
    private confirmationService: ConfirmationService,
    private productService: ProductService,
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
        this.productForm.disable();
      }

      if (this.formMode !== FORM_MODE.Create) {
        const id_product = Number(this.route.snapshot.paramMap.get('id'));

        this.loadProduct(id_product);
      }

      this.loadCategories();
    });
  }

  private createForm(): void {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(60)]],
      category_id: ['', [Validators.required]],
      cost_price: ['0', [Validators.required, Validators.min(0.01), Validators.max(999.99)]],
      sale_price: ['0', [Validators.required, Validators.min(0.01), Validators.max(999.99)]],
      units_stock: ['0', [Validators.required, Validators.max(9999)]],
      active: [true],
      photo: [''],
    });
  }


  private loadProduct(id: number): void {
    this.productService.loadByID(id).subscribe(product => {

      console.log(product);
      this.product = product;

      // create a clone of the loaded product to restore it when the Cancel button is clicked
      this.originalProduct = product;
      this.populateForm();
    });

  }

  private loadCategories(): void {
    this.categories = this.categoryService.loadAllOrderedByName();
  }

  private populateForm(): void {
    this.productForm.patchValue( this.product );
  }

  cancel(): void {
    this.confirmationService.confirm({ message: this.translateService.instant('global.confirm_cancel_msg'),
      accept: () => {

        this.productForm.reset();
        this.uploadService.removeUpload(); // remove the image upload preview
        if (this.formMode === FORM_MODE.Edit) {
          this.product = { ...this.originalProduct };
          this.populateForm();
        }

      }
    });

  }

  save(): void {
    const payload = this.buildPayload();

    if (this.formMode === FORM_MODE.Create) {
      this.productService.createProduct(payload).subscribe(data => {
        // this.success();
      });
    } else if (this.formMode === FORM_MODE.Edit) {
      this.productService.updateProduct(payload, this.route.snapshot.paramMap.get('id')).subscribe(data => {
        // this.success();
      });
    }
  }

  private success(): void {
    this.router.navigateByUrl('/products');
    this.notificationService.notify(this.translateService.instant('global.success_msg'),
    this.translateService.instant('products.successfull_save_msg', { value: this.productForm.get('name').value }), NotificationType.Success);
  }

  private buildPayload() {

    const data = this.productForm.value;
    data.photo = this.imageUpload.nativeElement.files[0];

    if (this.formMode === FORM_MODE.Create) {

      const payload = new FormData();

      payload.append('name', data.name);
      payload.append('category_id', data.category_id);
      payload.append('cost_price', data.cost_price);
      payload.append('sale_price', data.sale_price);
      payload.append('units_stock', data.units_stock);
      payload.append('active', data.active);
      payload.append('photo', data.photo, data.photo.name);
      payload.append('upload', this.uploadService.imgURL);

      return payload;

    } else if (this.formMode === FORM_MODE.Edit) {

      const payload = new FormData();

      payload.append('id', this.route.snapshot.paramMap.get('id'));
      payload.append('name', data.name);
      payload.append('category_id', data.category_id);
      payload.append('cost_price', data.cost_price);
      payload.append('sale_price', data.sale_price);
      payload.append('units_stock', data.units_stock);
      payload.append('active', data.active);
      payload.append('photo', data.photo, data.photo.name);
      payload.append('upload', this.uploadService.imgURL);

      return payload;
    }

  }

}
