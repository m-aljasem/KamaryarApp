import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseService } from './supabase.service';
import { User, UserProfile, Language } from '../models/user.model';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$: Observable<User | null> = this.currentUserSubject.asObservable();

  constructor(
    private supabase: SupabaseService,
    private router: Router
  ) {
    this.checkUser();
  }

  async checkUser(): Promise<void> {
    try {
      const { data: { user } } = await this.supabase.client.auth.getUser();
      if (user) {
        const profile = await this.supabase.getUserProfile(user.id);
        if (profile) {
          this.currentUserSubject.next(profile);
        }
      }
    } catch (error) {
      // Silently handle errors during check
      console.debug('User check error:', error);
    }
  }

  async signUp(email: string, password: string): Promise<void> {
    const { data, error } = await this.supabase.client.auth.signUp({
      email,
      password
    });

    if (error) throw error;
    
    if (data.user) {
      // Create user profile
      const { error: insertError } = await this.supabase.client
        .from('users')
        .insert({
          id: data.user.id,
          email: data.user.email,
          language: 'en' // Default language
        });
      
      if (insertError && insertError.code !== '23505') { // Ignore duplicate key errors
        console.error('Error creating user profile:', insertError);
      }
      
      // Try to get the profile after creation
      const profile = await this.supabase.getUserProfile(data.user.id);
      if (profile) {
        this.currentUserSubject.next(profile);
      }
    }
  }

  async signIn(email: string, password: string): Promise<void> {
    const { data, error } = await this.supabase.client.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;
    
    if (data.user) {
      // Try to get profile, create if doesn't exist
      let profile = await this.supabase.getUserProfile(data.user.id);
      
      if (!profile) {
        // Profile doesn't exist, create it
        const { error: insertError } = await this.supabase.client
          .from('users')
          .insert({
            id: data.user.id,
            email: data.user.email,
            language: 'en'
          });
        
        if (!insertError) {
          profile = await this.supabase.getUserProfile(data.user.id);
        }
      }
      
      if (profile) {
        this.currentUserSubject.next(profile);
      }
    }
  }

  async signInWithGoogle(): Promise<void> {
    const { data, error } = await this.supabase.client.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    });

    if (error) throw error;
  }

  async signOut(): Promise<void> {
    const { error } = await this.supabase.client.auth.signOut();
    if (error) throw error;
    
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  async updateProfile(userId: string, profile: UserProfile): Promise<void> {
    // Convert camelCase to snake_case for database
    const dbProfile = {
      first_name: profile.firstName,
      last_name: profile.lastName,
      gender: profile.gender,
      age: profile.age,
      country_name: profile.countryName,
      back_pain_years: profile.backPainYears,
      job_type: profile.jobType,
      weekly_activity_level: profile.weeklyActivityLevel
    };
    
    await this.supabase.updateUserProfile(userId, dbProfile as any);
    const updatedProfile = await this.supabase.getUserProfile(userId);
    if (updatedProfile) {
      this.currentUserSubject.next(updatedProfile);
    }
  }

  async updateLanguage(userId: string, language: Language): Promise<void> {
    await this.supabase.updateUserProfile(userId, { language });
    const updatedProfile = await this.supabase.getUserProfile(userId);
    if (updatedProfile) {
      this.currentUserSubject.next(updatedProfile);
    }
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  async isAuthenticated(): Promise<boolean> {
    const { data: { user } } = await this.supabase.client.auth.getUser();
    return !!user;
  }
}

