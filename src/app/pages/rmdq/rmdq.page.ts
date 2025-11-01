import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { AssessmentService } from '../../services/assessment.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-rmdq',
  templateUrl: './rmdq.page.html',
  styleUrls: ['./rmdq.page.scss'],
})
export class RMDQPage implements OnInit {
  answers: Record<number, boolean> = {};
  totalQuestions = 24;

  // RMDQ question keys for i18n
  questionKeys = [
    'RMDQ_Q1',
    'RMDQ_Q2',
    'RMDQ_Q3',
    'RMDQ_Q4',
    'RMDQ_Q5',
    'RMDQ_Q6',
    'RMDQ_Q7',
    'RMDQ_Q8',
    'RMDQ_Q9',
    'RMDQ_Q10',
    'RMDQ_Q11',
    'RMDQ_Q12',
    'RMDQ_Q13',
    'RMDQ_Q14',
    'RMDQ_Q15',
    'RMDQ_Q16',
    'RMDQ_Q17',
    'RMDQ_Q18',
    'RMDQ_Q19',
    'RMDQ_Q20',
    'RMDQ_Q21',
    'RMDQ_Q22',
    'RMDQ_Q23',
    'RMDQ_Q24'
  ];

  questions = Array.from({ length: 24 }, (_, i) => i + 1);

  constructor(
    private router: Router,
    private assessmentService: AssessmentService,
    private loadingController: LoadingController,
    private translate: TranslateService
  ) {}

  ngOnInit() {
    this.questions.forEach(q => {
      this.answers[q] = false;
    });
  }

  getQuestionText(questionNumber: number): string {
    const key = this.questionKeys[questionNumber - 1];
    return this.translate.instant(key);
  }

  get allQuestionsAnswered(): boolean {
    return this.questions.every(q => this.answers[q] !== undefined);
  }

  async submit() {
    const allAnswered = this.questions.every(q => this.answers[q] !== undefined);
    if (!allAnswered) return;

    const loading = await this.loadingController.create({
      message: this.translate.instant('SUBMITTING')
    });
    await loading.present();

    try {
      await this.assessmentService.saveRMDQAssessment(this.answers);
      await loading.dismiss();
      this.router.navigate(['/vas']);
    } catch (error) {
      await loading.dismiss();
      console.error('Error saving RMDQ assessment:', error);
    }
  }
}

