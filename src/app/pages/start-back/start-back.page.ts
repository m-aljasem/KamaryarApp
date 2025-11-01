import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { AssessmentService } from '../../services/assessment.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-start-back',
  templateUrl: './start-back.page.html',
  styleUrls: ['./start-back.page.scss'],
})
export class StartBackPage implements OnInit {
  answers: Record<number, number> = {};
  currentQuestion = 1;
  totalQuestions = 9;

  // STarT Back question keys for i18n
  questionKeys = [
    'START_BACK_Q1',
    'START_BACK_Q2',
    'START_BACK_Q3',
    'START_BACK_Q4',
    'START_BACK_Q5',
    'START_BACK_Q6',
    'START_BACK_Q7',
    'START_BACK_Q8',
    'START_BACK_Q9'
  ];

  constructor(
    private router: Router,
    private assessmentService: AssessmentService,
    private loadingController: LoadingController,
    private translate: TranslateService
  ) {}

  ngOnInit() {
    for (let i = 1; i < this.totalQuestions; i++) {
      this.answers[i] = 0; // Questions 1-8: Yes/No (0 or 1)
    }
    this.answers[9] = 1; // Question 9: 5-point scale (1-5, default to 1)
  }

  getCurrentQuestionText(): string {
    const key = this.questionKeys[this.currentQuestion - 1];
    return this.translate.instant(key);
  }

  answer(question: number, value: any) {
    // Convert to number explicitly to handle string values from ion-segment
    const numValue = Number(value);
    if (isNaN(numValue) || numValue === undefined || numValue === null) return;
    
    this.answers[question] = numValue;
    
    // Auto-advance to next question after a short delay (except for Q9)
    if (this.currentQuestion < this.totalQuestions && question !== 9) {
      setTimeout(() => {
        if (this.currentQuestion < this.totalQuestions) {
          this.currentQuestion++;
        }
      }, 400);
    }
  }

  goToPreviousQuestion() {
    if (this.currentQuestion > 1) {
      this.currentQuestion--;
    }
  }

  isLastQuestion(): boolean {
    return this.currentQuestion === 9;
  }

  async submit() {
    let allAnswered = true;
    for (let i = 1; i <= this.totalQuestions; i++) {
      if (this.answers[i] === undefined) {
        allAnswered = false;
        break;
      }
    }
    if (!allAnswered) return;

    const loading = await this.loadingController.create({
      message: this.translate.instant('SUBMITTING')
    });
    await loading.present();

    try {
      await this.assessmentService.saveStartBackAssessment(this.answers);
      await loading.dismiss();
      this.router.navigate(['/rmdq']);
    } catch (error) {
      await loading.dismiss();
      console.error('Error saving STarT Back assessment:', error);
    }
  }

  get progress(): number {
    return (this.currentQuestion / this.totalQuestions) * 100;
  }

  get canSubmit(): boolean {
    if (this.currentQuestion !== this.totalQuestions) return false;
    
    // Check questions 1-8 have answers (0 or 1)
    for (let i = 1; i < this.totalQuestions; i++) {
      if (this.answers[i] === undefined || this.answers[i] === null) return false;
    }
    
    // Check question 9 has answer (1-5)
    if (this.answers[9] === undefined || this.answers[9] === null || this.answers[9] < 1 || this.answers[9] > 5) {
      return false;
    }
    
    return true;
  }
}

