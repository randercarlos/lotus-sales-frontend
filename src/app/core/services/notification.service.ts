import { AppConfigService } from './app-config.service';
import { NotificationType } from '../enums/notification-type.enum';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private appConfig: AppConfigService) { }

  public notify(title: string, msg: string, type: NotificationType = NotificationType.Success,
    position: string = 'top center', duration: number = this.appConfig.duration): void {
    eval(`$.Notification.autoHideNotify('${type}', '${position}', '${title}','${msg}', ${duration});`);
  }
}
