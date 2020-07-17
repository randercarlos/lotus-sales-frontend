import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  public imgURL: any;
  private messages: string[] = [];

  constructor(private translate: TranslateService) { }

  // maxUploadSize is 50kb by default
  public preview(files, maxUploadSize: number = 51200) {

    if (this.validateUpload(files, maxUploadSize)) {
      let reader = new FileReader();
      reader.readAsDataURL(files[0]);
      reader.onload = (_event) => {
        this.imgURL = reader.result;
      }
    }
  }

  public removeUpload():void {
    this.imgURL = null;
    this.messages = [];
  }

  public getMessages(): string[] {
    return this.messages;
  }

  private validateUpload(files, maxUploadSize): boolean {
    if (files.length === 0) {
      return false;
    }

    let mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      this.messages.push(this.translate.instant('global.only_images'));
      return false;
    }
    this.messages.pop();

    let size = files[0].size;
    if (size > maxUploadSize) {
      this.messages.push(this.translate.instant('global.max_file_size', { value: maxUploadSize / 1024 }));
      return false;
    }
    this.messages.pop();

    return true;
  }
}
