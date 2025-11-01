import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PlanService } from '../../services/plan.service';
import { WeeklyPlan, ContentType } from '../../models/plan.model';
import { SupabaseService } from '../../services/supabase.service';
import { AuthService } from '../../services/auth.service';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-tab-exercises',
  templateUrl: './tab-exercises.page.html',
  styleUrls: ['./tab-exercises.page.scss'],
})
export class TabExercisesPage implements OnInit {
  weeklyPlan: WeeklyPlan | null = null;
  exercises: any[] = [];
  filteredExercises: any[] = [];
  searchTerm: string = '';
  selectedDifficulty: string = 'all';
  currentLang: string = 'en';

  constructor(
    private router: Router,
    private planService: PlanService,
    private supabase: SupabaseService,
    private authService: AuthService,
    private languageService: LanguageService
  ) {}

  async ngOnInit() {
    this.currentLang = this.languageService.getCurrentLanguage();
    await this.loadExercises();
  }

  async loadExercises() {
    const user = this.authService.getCurrentUser();
    if (!user) return;

    // Load exercises from database
    const { data, error } = await this.supabase.client
      .from('content_exercises')
      .select('*');

    if (!error && data) {
      this.exercises = data.map((ex: any) => ({
        id: ex.id,
        title: ex.name || {},
        description: ex.description || {},
        difficulty: 'medium', // Default since not in schema
        duration: 10, // Default since not in schema
        category: ex.category || 'general',
        videoUrl: ex.video_url,
        sets: ex.sets,
        reps: ex.reps
      }));
      this.filteredExercises = [...this.exercises];
    }
  }

  onSearchChange(event: any) {
    this.searchTerm = event.detail.value || '';
    this.applyFilters();
  }

  onDifficultyChange(difficulty: string) {
    this.selectedDifficulty = difficulty;
    this.applyFilters();
  }

  getLocalizedText(field: Record<string, string> | undefined): string {
    if (!field) return '';
    return field[this.currentLang] || field['en'] || '';
  }

  applyFilters() {
    this.filteredExercises = this.exercises.filter(ex => {
      const titleText = this.getLocalizedText(ex.title);
      const descText = this.getLocalizedText(ex.description);
      
      const matchesSearch = !this.searchTerm || 
        titleText.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        descText.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesDifficulty = this.selectedDifficulty === 'all' || 
        ex.difficulty === this.selectedDifficulty;
      
      return matchesSearch && matchesDifficulty;
    });
  }

  getDifficultyColor(difficulty: string): string {
    switch(difficulty?.toLowerCase()) {
      case 'easy': return 'success';
      case 'medium': return 'warning';
      case 'hard': return 'danger';
      default: return 'medium';
    }
  }

  getDifficultyIcon(difficulty: string): string {
    switch(difficulty?.toLowerCase()) {
      case 'easy': return 'checkmark-circle';
      case 'medium': return 'time';
      case 'hard': return 'flame';
      default: return 'fitness';
    }
  }

  goToActivity(activityId: string) {
    this.router.navigate(['/activity-detail', activityId]);
  }
}

