import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { AssessmentService } from '../../services/assessment.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-red-flag-screening',
  templateUrl: './red-flag-screening.page.html',
  styleUrls: ['./red-flag-screening.page.scss'],
})
export class RedFlagScreeningPage implements OnInit {
  answers: Record<string, boolean> = {};

  questions = [
    { id: 'q1', key: 'RED_FLAG_Q1' },
    { id: 'q2', key: 'RED_FLAG_Q2' },
    { id: 'q3', key: 'RED_FLAG_Q3' },
    { id: 'q4', key: 'RED_FLAG_Q4' },
    { id: 'q5', key: 'RED_FLAG_Q5' },
    { id: 'q6', key: 'RED_FLAG_Q6' }
  ];

  constructor(
    private router: Router,
    private assessmentService: AssessmentService,
    private loadingController: LoadingController,
    private translate: TranslateService
  ) {}

  ngOnInit() {
    this.questions.forEach(q => {
      this.answers[q.id] = false;
    });
  }

  get allQuestionsAnswered(): boolean {
    return this.questions.every(q => this.answers[q.id] !== undefined);
  }

  async submit() {
    if (!this.allQuestionsAnswered) {
      return;
    }

    const loading = await this.loadingController.create({
      message: this.translate.instant('SUBMITTING')
    });
    await loading.present();

    try {
      const result = await this.assessmentService.saveRedFlagAnswers(this.answers);
      await loading.dismiss();
      
      // Navigation is handled by the service, but we dismiss loading first
      // Small delay to ensure spinner dismisses before navigation
      setTimeout(() => {
        const hasRedFlag = result && result.score === 1;
        if (hasRedFlag) {
          this.router.navigate(['/red-flag-alert']);
        } else {
          this.router.navigate(['/pain-localization']);
        }
      }, 100);
    } catch (error) {
      await loading.dismiss();
      console.error('Error saving red flag assessment:', error);
    }
  }
}

