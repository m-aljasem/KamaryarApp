import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { AssessmentService } from '../../services/assessment.service';
import { PlanService } from '../../services/plan.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-vas',
  templateUrl: './vas.page.html',
  styleUrls: ['./vas.page.scss'],
})
export class VASPage implements OnInit {
  vasScore = 0;

  constructor(
    private router: Router,
    private assessmentService: AssessmentService,
    private planService: PlanService,
    private loadingController: LoadingController,
    private translate: TranslateService
  ) {}

  ngOnInit() {}

  async submit() {
    if (this.vasScore === undefined) return;

    const loading = await this.loadingController.create({
      message: this.translate.instant('SUBMITTING')
    });
    await loading.present();

    try {
      await this.assessmentService.saveVASScore(this.vasScore);
      
      // Generate weekly plan after completing assessment
      await this.planService.generateWeeklyPlan();
      
      await loading.dismiss();
      this.router.navigate(['/tabs/dashboard-tab']);
    } catch (error) {
      await loading.dismiss();
      console.error('Error saving VAS score:', error);
    }
  }
}

