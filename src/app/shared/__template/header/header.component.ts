import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  languages: any[];

  constructor(private translateService: TranslateService) { }

  ngOnInit(): void {
    this.languages = [
      { lang: 'Português', code: 'pt' , img: 'brazil.jpg' },
      { lang: 'English', code: 'en' , img: 'us.jpg' },
      // { lang: 'Español', code: 'es' , img: 'spain.jpg' }
    ];

    if (this.translateService.getBrowserLang() && this.languages
      .findIndex(language => language.code === this.translateService.getBrowserLang()) > -1) {
      this.setLanguageTo(this.translateService.getDefaultLang());
    }
  }

  public setLanguageTo(code: string): void {
    const selectLanguage = this.languages.filter(lang => lang.code === code).shift();
    this.languages = this.languages.filter(lang => lang.code !== code);
    this.languages.unshift(selectLanguage);

    this.translateService.use(code);
  }

}
