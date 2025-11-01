import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SupabaseService } from '../../services/supabase.service';
import { PlanService } from '../../services/plan.service';
import { ContentType } from '../../models/plan.model';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-activity-detail',
  templateUrl: './activity-detail.page.html',
  styleUrls: ['./activity-detail.page.scss'],
})
export class ActivityDetailPage implements OnInit {
  activityId: string = '';
  contentType: ContentType = ContentType.Exercise;
  contentId: string = '';
  content: any = null;
  currentLang: string = 'en';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private supabase: SupabaseService,
    private planService: PlanService,
    private languageService: LanguageService
  ) {}

  async ngOnInit() {
    this.activityId = this.route.snapshot.queryParams['id'];
    this.contentType = this.route.snapshot.queryParams['type'];
    this.contentId = this.route.snapshot.queryParams['contentId'];
    this.currentLang = this.languageService.getCurrentLanguage();

    await this.loadContent();
  }

  async loadContent() {
    try {
      if (this.contentType === ContentType.Exercise) {
        const exercises = await this.supabase.getExercises();
        this.content = exercises.find((e: any) => e.id === this.contentId);
      } else if (this.contentType === ContentType.Meditation) {
        const meditations = await this.supabase.getMeditations();
        this.content = meditations.find((m: any) => m.id === this.contentId);
      } else if (this.contentType === ContentType.Education) {
        const educations = await this.supabase.getEducation();
        this.content = educations.find((e: any) => e.id === this.contentId);
      }
    } catch (error) {
      console.error('Error loading content:', error);
    }
  }

  getLocalizedText(field: Record<string, string> | undefined): string {
    if (!field) return '';
    return field[this.currentLang] || field['en'] || '';
  }

  async completeActivity() {
    if (this.activityId) {
      await this.planService.completeActivity(this.activityId);
      this.router.navigate(['/weekly-plan']);
    }
  }
}

