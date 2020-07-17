import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  startedClass = false;
  completedClass = false;

  constructor(private translateService: TranslateService) {
    this.configTranslateLangs();
  }

  ngOnInit() {
    this.loadScript('assets/js/jquery.app.js');
  }

  public loadScript(url: string) {
    const body = document.body as HTMLDivElement;
    const script = document.createElement('script');
    script.innerHTML = '';
    script.src = url;
    script.async = false;
    script.defer = true;
    body.appendChild(script);
  }

  private configTranslateLangs(): void {
    this.translateService.addLangs(['pt', 'en', 'es']);
    this.translateService.setDefaultLang('pt');

    if (this.translateService.getBrowserLang() && this.translateService.getLangs()
      .findIndex(lang => lang === this.translateService.getBrowserLang()) > -1) {
      // this.translateService.use(this.translateService.getBrowserLang());
    }
  }
}
