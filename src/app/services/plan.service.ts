import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { AuthService } from './auth.service';
import { WeeklyPlan, DailyActivity, ActivityStatus } from '../models/plan.model';
import { AssessmentService } from './assessment.service';

@Injectable({
  providedIn: 'root'
})
export class PlanService {
  constructor(
    private supabase: SupabaseService,
    private auth: AuthService,
    private assessment: AssessmentService
  ) {}

  async getCurrentWeeklyPlan(): Promise<WeeklyPlan | null> {
    const user = this.auth.getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    return await this.supabase.getWeeklyPlan(user.id);
  }

  async generateWeeklyPlan(): Promise<WeeklyPlan> {
    const user = this.auth.getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    // Get latest assessments
    const startBack = await this.assessment.getLatestAssessment('start_back' as any);
    const rmqd = await this.assessment.getLatestAssessment('rmdq' as any);
    const vas = await this.assessment.getLatestAssessment('vas' as any);

    const assessmentData = {
      startBack: startBack ? startBack.rawAnswers : null,
      rmqd: rmqd ? rmqd.rawAnswers : null,
      vas: vas ? vas.rawAnswers : null,
      userProfile: {
        age: user.age,
        jobType: user.jobType,
        weeklyActivityLevel: user.weeklyActivityLevel
      }
    };

    return await this.supabase.generateWeeklyPlan(user.id, assessmentData);
  }

  async completeActivity(activityId: string): Promise<void> {
    await this.supabase.updateActivityStatus(
      activityId,
      ActivityStatus.Complete,
      new Date().toISOString()
    );
  }

  async getActivitiesForDay(dayOfWeek: number): Promise<DailyActivity[]> {
    const plan = await this.getCurrentWeeklyPlan();
    if (!plan) return [];

    return plan.dailyActivities.filter(activity => activity.dayOfWeek === dayOfWeek);
  }

  async getWeekAdherence(): Promise<number> {
    const plan = await this.getCurrentWeeklyPlan();
    if (!plan || !plan.dailyActivities.length) return 0;

    const completed = plan.dailyActivities.filter(
      activity => activity.status === ActivityStatus.Complete
    ).length;

    return Math.round((completed / plan.dailyActivities.length) * 100);
  }
}

