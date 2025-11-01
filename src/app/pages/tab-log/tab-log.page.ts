import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { SupabaseService } from '../../services/supabase.service';
import { AuthService } from '../../services/auth.service';
import { PainLog } from '../../models/pain-log.model';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-tab-log',
  templateUrl: './tab-log.page.html',
  styleUrls: ['./tab-log.page.scss'],
})
export class TabLogPage implements OnInit {
  painLogs: PainLog[] = [];
  todayScore: number | null = null;

  constructor(
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
    const today = new Date().toDateString();
    const todayLog = this.painLogs.find(log => {
      const logDate = new Date(log.loggedAt).toDateString();
      return logDate === today;
    });

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
      await loading.dismiss();
      await this.loadLogs();
      this.checkTodayLog();
    } catch (error) {
      await loading.dismiss();
      console.error('Error saving pain log:', error);
    }
  }

  getAverageScore(): number {
    if (this.painLogs.length === 0) return 0;
    const sum = this.painLogs.reduce((acc, log) => acc + log.vasScore, 0);
    return sum / this.painLogs.length;
  }

  getTrend(): string {
    if (this.painLogs.length < 2) return 'STABLE';
    const recent = this.painLogs.slice(-7).map(log => log.vasScore);
    const older = this.painLogs.slice(-14, -7).map(log => log.vasScore);
    
    if (older.length === 0) return 'STABLE';
    
    const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
    const olderAvg = older.reduce((a, b) => a + b, 0) / older.length;
    
    if (recentAvg < olderAvg - 0.5) return 'IMPROVING';
    if (recentAvg > olderAvg + 0.5) return 'WORSENING';
    return 'STABLE';
  }

  getStreak(): number {
    if (this.painLogs.length === 0) return 0;
    
    const sortedLogs = [...this.painLogs].sort((a, b) => 
      new Date(b.loggedAt).getTime() - new Date(a.loggedAt).getTime()
    );
    
    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    
    for (const log of sortedLogs) {
      const logDate = new Date(log.loggedAt);
      logDate.setHours(0, 0, 0, 0);
      
      const diffDays = Math.floor((currentDate.getTime() - logDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffDays === streak) {
        streak++;
      } else if (diffDays > streak) {
        break;
      }
    }
    
    return streak;
  }

  getWeeklyStats(): any {
    const weekLogs = this.painLogs.filter(log => {
      const logDate = new Date(log.loggedAt);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return logDate >= weekAgo;
    });
    
    if (weekLogs.length === 0) {
      return { best: null, worst: null, average: 0, bestScore: 0, worstScore: 0 };
    }
    
    const scores = weekLogs.map(log => log.vasScore);
    const best = Math.min(...scores);
    const worst = Math.max(...scores);
    const average = scores.reduce((a, b) => a + b, 0) / scores.length;
    
    const bestLog = weekLogs.find(log => log.vasScore === best);
    const worstLog = weekLogs.find(log => log.vasScore === worst);
    
    return {
      best: bestLog ? new Date(bestLog.loggedAt) : null,
      worst: worstLog ? new Date(worstLog.loggedAt) : null,
      average: average,
      bestScore: best,
      worstScore: worst
    };
  }
}
