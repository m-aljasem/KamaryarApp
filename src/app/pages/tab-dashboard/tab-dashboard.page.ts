import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { SupabaseService } from '../../services/supabase.service';
import { PlanService } from '../../services/plan.service';
import { PainLog } from '../../models/pain-log.model';
import { Assessment, AssessmentType } from '../../models/assessment.model';

@Component({
  selector: 'app-tab-dashboard',
  templateUrl: './tab-dashboard.page.html',
  styleUrls: ['./tab-dashboard.page.scss'],
})
export class TabDashboardPage implements OnInit {
  user: any;
  painLogs: PainLog[] = [];
  rmqdAssessments: Assessment[] = [];
  adherence: number = 0;
  latestRMDQ: Assessment | null = null;

  vasChartData: any = null;
  rmqdChartData: any = null;
  motivationalQuote: string = '';

  constructor(
    private router: Router,
    private authService: AuthService,
    private supabase: SupabaseService,
    private planService: PlanService
  ) {}

  async ngOnInit() {
    this.user = this.authService.getCurrentUser();
    this.setMotivationalQuote();
    await this.loadData();
  }

  private setMotivationalQuote() {
    const quotes = ['MOTIVATIONAL_QUOTE_1', 'MOTIVATIONAL_QUOTE_2', 'MOTIVATIONAL_QUOTE_3'];
    this.motivationalQuote = quotes[Math.floor(Math.random() * quotes.length)];
  }

  async loadData() {
    if (!this.user) return;

    // Load pain logs
    this.painLogs = await this.supabase.getPainLogs(this.user.id);
    
    // Load adherence
    this.adherence = await this.planService.getWeekAdherence();
    
    // Load all RMDQ assessments
    this.rmqdAssessments = await this.supabase.getAssessments(this.user.id, AssessmentType.RMDQ);
    this.latestRMDQ = this.rmqdAssessments.length > 0 ? this.rmqdAssessments[0] : null;

    // Prepare chart data
    this.prepareVASChartData();
    this.prepareRMDQChartData();
  }

  private prepareVASChartData() {
    if (this.painLogs.length === 0) {
      this.vasChartData = {
        labels: [],
        datasets: []
      };
      return;
    }

    // Sort by date
    const sortedLogs = [...this.painLogs].sort((a, b) => 
      new Date(a.loggedAt).getTime() - new Date(b.loggedAt).getTime()
    );

    const labels = sortedLogs.map(log => {
      const date = new Date(log.loggedAt);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    });

    const scores = sortedLogs.map(log => log.vasScore);

    this.vasChartData = {
      labels,
      datasets: [{
        label: 'Pain Intensity (VAS)',
        data: scores,
        borderColor: 'rgb(33, 150, 243)',
        backgroundColor: 'rgba(33, 150, 243, 0.1)',
        tension: 0.4,
        fill: true
      }]
    };
  }

  private prepareRMDQChartData() {
    if (this.rmqdAssessments.length === 0) {
      this.rmqdChartData = {
        labels: [],
        datasets: []
      };
      return;
    }

    // Sort by date
    const sortedAssessments = [...this.rmqdAssessments].sort((a, b) =>
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

    const labels = sortedAssessments.map(assessment => {
      const date = new Date(assessment.createdAt);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    });

    const scores = sortedAssessments.map(assessment => assessment.score || 0);

    this.rmqdChartData = {
      labels,
      datasets: [{
        label: 'RMDQ Score',
        data: scores,
        borderColor: 'rgb(76, 175, 80)',
        backgroundColor: 'rgba(76, 175, 80, 0.1)',
        tension: 0.4,
        fill: true
      }]
    };
  }

  getVASChartOptions() {
    return {
      scales: {
        y: {
          beginAtZero: true,
          max: 10,
          ticks: {
            stepSize: 1
          }
        }
      },
      plugins: {
        legend: {
          display: true
        },
        tooltip: {
          enabled: true
        }
      }
    };
  }

  getRMDQChartOptions() {
    return {
      scales: {
        y: {
          beginAtZero: true,
          max: 24,
          ticks: {
            stepSize: 2
          }
        }
      },
      plugins: {
        legend: {
          display: true
        },
        tooltip: {
          enabled: true
        }
      }
    };
  }

  goToWeeklyPlan() {
    this.router.navigate(['/weekly-plan']);
  }

  goToPainLog() {
    this.router.navigate(['/tabs/log']);
  }
}

