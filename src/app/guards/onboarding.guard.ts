import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class OnboardingGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  async canActivate(): Promise<boolean> {
    const user = this.authService.getCurrentUser();
    if (!user || !user.firstName || !user.lastName) {
      this.router.navigate(['/profile-setup']);
      return false;
    }
    return true;
  }
}

