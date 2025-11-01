import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  email = '';
  password = '';
  confirmPassword = '';

  constructor(
    private router: Router,
    private authService: AuthService,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private translate: TranslateService
  ) {}

  ngOnInit() {}

  async register() {
    if (!this.email || !this.password || !this.confirmPassword) {
      const alert = await this.alertController.create({
        header: this.translate.instant('ERROR'),
        message: this.translate.instant('PLEASE_FILL_ALL_FIELDS'),
        buttons: ['OK']
      });
      await alert.present();
      return;
    }

    if (this.password !== this.confirmPassword) {
      const alert = await this.alertController.create({
        header: this.translate.instant('ERROR'),
        message: this.translate.instant('PASSWORDS_DO_NOT_MATCH'),
        buttons: ['OK']
      });
      await alert.present();
      return;
    }

    const loading = await this.loadingController.create({
      message: this.translate.instant('CREATING_ACCOUNT')
    });
    await loading.present();

    try {
      await this.authService.signUp(this.email, this.password);
      await loading.dismiss();
      this.router.navigate(['/profile-setup']);
    } catch (error: any) {
      await loading.dismiss();
      const alert = await this.alertController.create({
        header: this.translate.instant('ERROR'),
        message: error.message || this.translate.instant('REGISTRATION_FAILED'),
        buttons: ['OK']
      });
      await alert.present();
    }
  }

  async registerWithGoogle() {
    try {
      await this.authService.signInWithGoogle();
    } catch (error: any) {
      const alert = await this.alertController.create({
        header: this.translate.instant('ERROR'),
        message: error.message || this.translate.instant('REGISTRATION_FAILED'),
        buttons: ['OK']
      });
      await alert.present();
    }
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}

