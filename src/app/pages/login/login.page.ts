import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  email = '';
  password = '';

  constructor(
    private router: Router,
    private authService: AuthService,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private translate: TranslateService
  ) {}

  ngOnInit() {}

  async login() {
    if (!this.email || !this.password) {
      const alert = await this.alertController.create({
        header: this.translate.instant('ERROR'),
        message: this.translate.instant('PLEASE_FILL_ALL_FIELDS'),
        buttons: ['OK']
      });
      await alert.present();
      return;
    }

    const loading = await this.loadingController.create({
      message: this.translate.instant('LOGGING_IN')
    });
    await loading.present();

    try {
      await this.authService.signIn(this.email, this.password);
      await loading.dismiss();
      
      const user = this.authService.getCurrentUser();
      
      if (user && user.firstName && user.lastName) {
        this.router.navigate(['/tabs/dashboard-tab']);
      } else {
        this.router.navigate(['/profile-setup']);
      }
    } catch (error: any) {
      await loading.dismiss();
      const alert = await this.alertController.create({
        header: this.translate.instant('ERROR'),
        message: error.message || this.translate.instant('LOGIN_FAILED'),
        buttons: ['OK']
      });
      await alert.present();
    }
  }

  async loginWithGoogle() {
    try {
      await this.authService.signInWithGoogle();
    } catch (error: any) {
      const alert = await this.alertController.create({
        header: this.translate.instant('ERROR'),
        message: error.message || this.translate.instant('LOGIN_FAILED'),
        buttons: ['OK']
      });
      await alert.present();
    }
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }
}

