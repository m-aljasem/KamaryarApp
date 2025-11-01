import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PlanService } from '../../services/plan.service';
import { WeeklyPlan, DailyActivity } from '../../models/plan.model';

@Component({
  selector: 'app-weekly-plan',
  templateUrl: './weekly-plan.page.html',
  styleUrls: ['./weekly-plan.page.scss'],
})
export class WeeklyPlanPage implements OnInit {
  weeklyPlan: WeeklyPlan | null = null;
  currentDay = new Date().getDay();

  days = [
    { id: 0, name: 'Sunday' },
    { id: 1, name: 'Monday' },
    { id: 2, name: 'Tuesday' },
    { id: 3, name: 'Wednesday' },
    { id: 4, name: 'Thursday' },
    { id: 5, name: 'Friday' },
    { id: 6, name: 'Saturday' }
  ];

  constructor(
    private router: Router,
    private planService: PlanService
  ) {}

  async ngOnInit() {
    await this.loadPlan();
  }

  async loadPlan() {
    this.weeklyPlan = await this.planService.getCurrentWeeklyPlan();
    if (!this.weeklyPlan) {
      // Generate plan if doesn't exist
      this.weeklyPlan = await this.planService.generateWeeklyPlan();
    }
  }

  getActivitiesForDay(day: number): DailyActivity[] {
    if (!this.weeklyPlan) return [];
    return this.weeklyPlan.dailyActivities.filter(a => a.dayOfWeek === day);
  }

  goToActivity(activity: DailyActivity) {
    this.router.navigate(['/activity-detail'], {
      queryParams: { 
        id: activity.id,
        type: activity.contentType,
        contentId: activity.contentId
      }
    });
  }

  async completeActivity(activity: DailyActivity) {
    await this.planService.completeActivity(activity.id);
    await this.loadPlan();
  }
}

