import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';
import { User } from '../models/user.model';
import { Assessment, AssessmentType } from '../models/assessment.model';
import { PainLog } from '../models/pain-log.model';
import { WeeklyPlan } from '../models/plan.model';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storage: typeof window !== 'undefined' ? window.localStorage : undefined
      }
    });
  }

  get client(): SupabaseClient {
    return this.supabase;
  }

  // User methods
  async getUserProfile(userId: string): Promise<User | null> {
    const { data, error } = await this.supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
    
    if (error && error.code !== 'PGRST116') throw error;
    if (!data) return null;
    
    // Convert snake_case to camelCase
    return {
      id: data.id,
      email: data.email,
      firstName: data.first_name || '',
      lastName: data.last_name || '',
      gender: data.gender,
      age: data.age || 0,
      countryName: data.country_name || '',
      backPainYears: data.back_pain_years || 0,
      jobType: data.job_type || 'Mostly Sitting',
      weeklyActivityLevel: data.weekly_activity_level || 'Sedentary',
      language: data.language || 'en',
      createdAt: data.created_at,
      updatedAt: data.updated_at
    } as User;
  }

  async updateUserProfile(userId: string, profile: Partial<any>): Promise<User> {
    const { data, error } = await this.supabase
      .from('users')
      .update(profile)
      .eq('id', userId)
      .select()
      .single();
    
    if (error) throw error;
    if (!data) throw new Error('Failed to update profile');
    
    // Convert snake_case to camelCase
    return {
      id: data.id,
      email: data.email,
      firstName: data.first_name || '',
      lastName: data.last_name || '',
      gender: data.gender,
      age: data.age || 0,
      countryName: data.country_name || '',
      backPainYears: data.back_pain_years || 0,
      jobType: data.job_type || 'Mostly Sitting',
      weeklyActivityLevel: data.weekly_activity_level || 'Sedentary',
      language: data.language || 'en',
      createdAt: data.created_at,
      updatedAt: data.updated_at
    } as User;
  }

  // Assessment methods
  async saveAssessment(assessment: Partial<Assessment>): Promise<Assessment> {
    // Convert camelCase to snake_case for database
    const dbAssessment: any = {
      user_id: assessment.userId,
      assessment_type: assessment.assessmentType,
      score: assessment.score,
      raw_answers: assessment.rawAnswers
    };

    const { data, error } = await this.supabase
      .from('assessments')
      .insert(dbAssessment)
      .select()
      .single();
    
    if (error) throw error;
    if (!data) throw new Error('Failed to save assessment');

    // Convert snake_case back to camelCase
    return {
      id: data.id,
      userId: data.user_id,
      assessmentType: data.assessment_type,
      score: data.score,
      rawAnswers: data.raw_answers,
      createdAt: data.created_at
    } as Assessment;
  }

  async getAssessments(userId: string, type?: AssessmentType): Promise<Assessment[]> {
    let query = this.supabase
      .from('assessments')
      .select('*')
      .eq('user_id', userId);
    
    if (type) {
      query = query.eq('assessment_type', type);
    }
    
    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) throw error;
    if (!data) return [];

    // Convert snake_case to camelCase
    return data.map((item: any) => ({
      id: item.id,
      userId: item.user_id,
      assessmentType: item.assessment_type,
      score: item.score,
      rawAnswers: item.raw_answers,
      createdAt: item.created_at
    })) as Assessment[];
  }

  // Pain log methods
  async savePainLog(painLog: Partial<PainLog>): Promise<PainLog> {
    // Convert camelCase to snake_case for database
    const dbPainLog: any = {
      user_id: painLog.userId,
      vas_score: painLog.vasScore,
      logged_at: painLog.loggedAt
    };

    const { data, error } = await this.supabase
      .from('pain_logs')
      .insert(dbPainLog)
      .select()
      .single();
    
    if (error) throw error;
    if (!data) throw new Error('Failed to save pain log');

    // Convert snake_case back to camelCase
    return {
      id: data.id,
      userId: data.user_id,
      vasScore: data.vas_score,
      loggedAt: data.logged_at,
      createdAt: data.created_at
    } as PainLog;
  }

  async getPainLogs(userId: string, startDate?: string, endDate?: string): Promise<PainLog[]> {
    let query = this.supabase
      .from('pain_logs')
      .select('*')
      .eq('user_id', userId);
    
    if (startDate) {
      query = query.gte('logged_at', startDate);
    }
    if (endDate) {
      query = query.lte('logged_at', endDate);
    }
    
    const { data, error } = await query.order('logged_at', { ascending: true });
    
    if (error) throw error;
    if (!data) return [];

    // Convert snake_case to camelCase
    return data.map((item: any) => ({
      id: item.id,
      userId: item.user_id,
      vasScore: item.vas_score,
      loggedAt: item.logged_at,
      createdAt: item.created_at
    })) as PainLog[];
  }

  // Weekly plan methods
  async getWeeklyPlan(userId: string, startDate?: string): Promise<WeeklyPlan | null> {
    let query = this.supabase
      .from('weekly_plans')
      .select(`
        *,
        daily_activities (*)
      `)
      .eq('user_id', userId);
    
    if (startDate) {
      query = query.eq('start_date', startDate);
    } else {
      // Get current week's plan
      const now = new Date();
      const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
      query = query.gte('start_date', weekStart.toISOString().split('T')[0]);
    }
    
    const { data, error } = await query.order('start_date', { ascending: false }).limit(1).maybeSingle();
    
    if (error) throw error;
    return data || null;
  }

  async updateActivityStatus(activityId: string, status: string, completedAt?: string): Promise<void> {
    const updateData: any = { status };
    if (completedAt) {
      updateData.completed_at = completedAt;
    }
    
    const { error } = await this.supabase
      .from('daily_activities')
      .update(updateData)
      .eq('id', activityId);
    
    if (error) throw error;
  }

  // Content methods
  async getExercises(): Promise<any[]> {
    const { data, error } = await this.supabase
      .from('content_exercises')
      .select('*');
    
    if (error) throw error;
    return data || [];
  }

  async getMeditations(): Promise<any[]> {
    const { data, error } = await this.supabase
      .from('content_meditations')
      .select('*');
    
    if (error) throw error;
    return data || [];
  }

  async getEducation(): Promise<any[]> {
    const { data, error } = await this.supabase
      .from('content_education')
      .select('*');
    
    if (error) throw error;
    return data || [];
  }

  // Generate weekly plan via Edge Function
  async generateWeeklyPlan(userId: string, assessmentData: any): Promise<WeeklyPlan> {
    const { data, error } = await this.supabase.functions.invoke('generate-weekly-plan', {
      body: {
        userId,
        assessmentData
      }
    });
    
    if (error) throw error;
    return data;
  }
}

