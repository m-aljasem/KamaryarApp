import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AssessmentService } from '../services/assessment.service';

@Injectable({
  providedIn: 'root'
})
export class RedFlagGuard implements CanActivate {
  constructor(
    private assessmentService: AssessmentService,
    private router: Router
  ) {}

  async canActivate(): Promise<boolean> {
    const hasRedFlags = await this.assessmentService.hasRedFlags();
    if (hasRedFlags) {
      this.router.navigate(['/red-flag-alert']);
      return false;
    }
    return true;
  }
}

