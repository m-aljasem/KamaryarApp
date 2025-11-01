import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LanguageService } from '../../services/language.service';
import { Language } from '../../models/user.model';

@Component({
  selector: 'app-language-select',
  templateUrl: './language-select.page.html',
  styleUrls: ['./language-select.page.scss'],
})
export class LanguageSelectPage implements OnInit {
  languages = [
    { code: Language.English, name: 'English', flag: '🇺🇸' },
    { code: Language.Persian, name: 'فارسی', flag: '🇮🇷' },
    { code: Language.Arabic, name: 'العربية', flag: '🇸🇦' }
  ];

  constructor(
    private router: Router,
    private languageService: LanguageService
  ) {}

  ngOnInit() {}

  selectLanguage(language: Language) {
    this.languageService.setLanguage(language);
    this.router.navigate(['/login']);
  }
}

