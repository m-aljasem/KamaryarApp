import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { Assessment, AssessmentType, StartBackResult, PainLocalization } from '../models/assessment.model';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AssessmentService {
  constructor(
    private supabase: SupabaseService,
    private auth: AuthService,
    private router: Router
  ) {}

  async saveRedFlagAnswers(answers: Record<string, boolean>): Promise<Assessment> {
    const user = this.auth.getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    // Check if any red flag is true
    const hasRedFlag = Object.values(answers).some(answer => answer === true);

    const assessment: Partial<Assessment> = {
      userId: user.id,
      assessmentType: AssessmentType.RedFlags,
      rawAnswers: answers,
      score: hasRedFlag ? 1 : 0
    };

    const saved = await this.supabase.saveAssessment(assessment);

    // Return the saved assessment - navigation will be handled by the component
    // This allows the component to dismiss the loading spinner before navigation
    return saved;
  }

  async savePainLocalization(localization: PainLocalization): Promise<void> {
    const user = this.auth.getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    // Save pain localization as part of the assessment flow
    // We can store it in rawAnswers of a red flags assessment or create a separate entry
    // For now, we'll store it and move forward
    // The actual storage can be handled in the next assessment step
    return Promise.resolve();
  }

  calculateStartBackScore(answers: Record<number, number>): StartBackResult {
    // Questions 5-9 are psychosocial subscale
    const psychosocialQuestions = [5, 6, 7, 8, 9];
    
    let totalScore = 0;
    let psychosocialScore = 0;

    for (const [questionId, answer] of Object.entries(answers)) {
      const qId = parseInt(questionId);
      totalScore += answer;
      if (psychosocialQuestions.includes(qId)) {
        psychosocialScore += answer;
      }
    }

    let riskLevel: 'low' | 'medium' | 'high';
    if (totalScore >= 4) {
      riskLevel = psychosocialScore >= 4 ? 'high' : 'medium';
    } else {
      riskLevel = 'low';
    }

    return {
      totalScore,
      psychosocialScore,
      riskLevel
    };
  }

  async saveStartBackAssessment(answers: Record<number, number>): Promise<Assessment> {
    const user = this.auth.getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    const result = this.calculateStartBackScore(answers);

    const assessment: Partial<Assessment> = {
      userId: user.id,
      assessmentType: AssessmentType.StartBack,
      rawAnswers: { answers, result },
      score: result.totalScore
    };

    return await this.supabase.saveAssessment(assessment);
  }

  calculateRMDQScore(answers: Record<number, boolean>): number {
    return Object.values(answers).filter(answer => answer === true).length;
  }

  async saveRMDQAssessment(answers: Record<number, boolean>): Promise<Assessment> {
    const user = this.auth.getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    const score = this.calculateRMDQScore(answers);

    const assessment: Partial<Assessment> = {
      userId: user.id,
      assessmentType: AssessmentType.RMDQ,
      rawAnswers: { answers },
      score
    };

    return await this.supabase.saveAssessment(assessment);
  }

  async saveVASScore(vasScore: number): Promise<Assessment> {
    const user = this.auth.getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    const assessment: Partial<Assessment> = {
      userId: user.id,
      assessmentType: AssessmentType.VAS,
      rawAnswers: { vasScore },
      score: vasScore
    };

    return await this.supabase.saveAssessment(assessment);
  }

  async getLatestAssessment(type: AssessmentType): Promise<Assessment | null> {
    const user = this.auth.getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    const assessments = await this.supabase.getAssessments(user.id, type);
    return assessments.length > 0 ? assessments[0] : null;
  }

  async hasRedFlags(): Promise<boolean> {
    const assessment = await this.getLatestAssessment(AssessmentType.RedFlags);
    return assessment?.score === 1;
  }
}

