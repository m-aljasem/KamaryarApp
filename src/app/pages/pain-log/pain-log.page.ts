import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { SupabaseService } from '../../services/supabase.service';
import { AuthService } from '../../services/auth.service';
import { PainLog } from '../../models/pain-log.model';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-pain-log',
  templateUrl: './pain-log.page.html',
  styleUrls: ['./pain-log.page.scss'],
})
export class PainLogPage implements OnInit {
  painLogs: PainLog[] = [];
  todayScore: number | null = null;

  constructor(
    private router: Router,
    private supabase: SupabaseService,
    private authService: AuthService,
    private loadingController: LoadingController,
    private translate: TranslateService
  ) {}

  async ngOnInit() {
    await this.loadLogs();
    this.checkTodayLog();
  }

  async loadLogs() {
    const user = this.authService.getCurrentUser();
    if (!user) return;

    this.painLogs = await this.supabase.getPainLogs(user.id);
  }

  checkTodayLog() {
    const today = new Date().toISOString().split('T')[0];
    const todayLog = this.painLogs.find(log => log.loggedAt.startsWith(today));
    if (todayLog) {
      this.todayScore = todayLog.vasScore;
    }
  }

  async logPain(score: number) {
    const user = this.authService.getCurrentUser();
    if (!user) return;

    const loading = await this.loadingController.create({
      message: this.translate.instant('SAVING')
    });
    await loading.present();

    try {
      await this.supabase.savePainLog({
        userId: user.id,
        vasScore: score,
        loggedAt: new Date().toISOString()
      });
      
      this.todayScore = score;
      await this.loadLogs();
      await loading.dismiss();
    } catch (error) {
      await loading.dismiss();
      console.error('Error saving pain log:', error);
    }
  }
}

