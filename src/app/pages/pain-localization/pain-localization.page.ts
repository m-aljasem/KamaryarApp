import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { AssessmentService } from '../../services/assessment.service';
import { PainLocalization } from '../../models/assessment.model';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-pain-localization',
  templateUrl: './pain-localization.page.html',
  styleUrls: ['./pain-localization.page.scss'],
})
export class PainLocalizationPage implements OnInit {
  view: 'anterior' | 'posterior' = 'anterior';
  selectedAreas: PainLocalization = {
    anterior: [],
    posterior: []
  };

  // Body regions for clicking (simplified numbering system)
  bodyRegions: { id: number; name: string; path: string }[] = [
    // Anterior regions
    { id: 1, name: 'Head', path: 'M 50,20 L 50,40' },
    { id: 2, name: 'Neck', path: 'M 50,40 L 50,60' },
    { id: 3, name: 'Shoulder Left', path: 'M 30,60 L 30,90' },
    { id: 4, name: 'Shoulder Right', path: 'M 70,60 L 70,90' },
    { id: 5, name: 'Chest Upper', path: 'M 40,60 L 60,60 L 60,90 L 40,90 Z' },
    { id: 6, name: 'Chest Lower', path: 'M 40,90 L 60,90 L 60,120 L 40,120 Z' },
    { id: 7, name: 'Abdomen Upper', path: 'M 40,120 L 60,120 L 60,150 L 40,150 Z' },
    { id: 8, name: 'Abdomen Lower', path: 'M 40,150 L 60,150 L 60,180 L 40,180 Z' },
    { id: 9, name: 'Upper Back', path: 'M 40,60 L 60,60 L 60,90 L 40,90 Z' },
    { id: 10, name: 'Lower Back', path: 'M 40,90 L 60,90 L 60,120 L 40,120 Z' },
    { id: 11, name: 'Hip Left', path: 'M 35,180 L 45,180 L 45,200 L 35,200 Z' },
    { id: 12, name: 'Hip Right', path: 'M 55,180 L 65,180 L 65,200 L 55,200 Z' },
    { id: 13, name: 'Thigh Left', path: 'M 35,200 L 45,200 L 45,280 L 35,280 Z' },
    { id: 14, name: 'Thigh Right', path: 'M 55,200 L 65,200 L 65,280 L 55,280 Z' },
    { id: 15, name: 'Knee Left', path: 'M 35,280 L 45,280 L 45,300 L 35,300 Z' },
    { id: 16, name: 'Knee Right', path: 'M 55,280 L 65,280 L 65,300 L 55,300 Z' },
    { id: 17, name: 'Leg Left', path: 'M 35,300 L 45,300 L 45,380 L 35,380 Z' },
    { id: 18, name: 'Leg Right', path: 'M 55,300 L 65,300 L 65,380 L 55,380 Z' }
  ];

  constructor(
    private router: Router,
    private assessmentService: AssessmentService,
    private loadingController: LoadingController,
    private translate: TranslateService
  ) {}

  ngOnInit() {}

  toggleView() {
    this.view = this.view === 'anterior' ? 'posterior' : 'anterior';
  }

  toggleRegion(regionId: number) {
    const currentArray = this.view === 'anterior' ? this.selectedAreas.anterior : this.selectedAreas.posterior;
    const index = currentArray.indexOf(regionId);
    
    if (index > -1) {
      // Remove if already selected
      currentArray.splice(index, 1);
    } else {
      // Add if not selected
      currentArray.push(regionId);
    }
  }

  isRegionSelected(regionId: number): boolean {
    const currentArray = this.view === 'anterior' ? this.selectedAreas.anterior : this.selectedAreas.posterior;
    return currentArray.includes(regionId);
  }

  async continue() {
    // Save pain localization (optional - can be skipped if not critical)
    try {
      await this.assessmentService.savePainLocalization(this.selectedAreas);
    } catch (error) {
      console.error('Error saving pain localization:', error);
      // Continue anyway as this is optional data
    }
    
    // Navigate to next step
    this.router.navigate(['/start-back']);
  }
}

