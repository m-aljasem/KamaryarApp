import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { StatusBar, Style } from '@capacitor/status-bar';
import { LanguageService } from './services/language.service';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent implements OnInit {
  constructor(
    private platform: Platform,
    private languageService: LanguageService,
    private authService: AuthService
  ) {
    this.initializeApp();
  }

  async initializeApp() {
    await this.platform.ready();
    
    // Initialize language
    this.languageService.initializeLanguage();
    
    // Check authentication status
    await this.authService.checkUser();
    
    // Set status bar style
    if (this.platform.is('capacitor')) {
      await StatusBar.setStyle({ style: Style.Light });
    }
  }

  ngOnInit() {}
}

