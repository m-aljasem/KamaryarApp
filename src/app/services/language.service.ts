import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Language } from '../models/user.model';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private currentLanguageSubject = new BehaviorSubject<Language>(Language.English);
  public currentLanguage$ = this.currentLanguageSubject.asObservable();

  constructor(private translate: TranslateService) {
    this.translate.setDefaultLang(Language.English);
    this.translate.addLangs([Language.English, Language.Persian, Language.Arabic]);
  }

  setLanguage(lang: Language): void {
    this.currentLanguageSubject.next(lang);
    this.translate.use(lang);
    
    // Set document direction
    const isRTL = lang === Language.Persian || lang === Language.Arabic;
    document.documentElement.setAttribute('dir', isRTL ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', lang);
    
    // Store in localStorage
    localStorage.setItem('kamaryar_language', lang);
  }

  getCurrentLanguage(): Language {
    return this.currentLanguageSubject.value;
  }

  isRTL(): boolean {
    const lang = this.getCurrentLanguage();
    return lang === Language.Persian || lang === Language.Arabic;
  }

  initializeLanguage(): void {
    const savedLang = localStorage.getItem('kamaryar_language') as Language;
    if (savedLang && Object.values(Language).includes(savedLang)) {
      this.setLanguage(savedLang);
    } else {
      this.setLanguage(Language.English);
    }
  }
}

