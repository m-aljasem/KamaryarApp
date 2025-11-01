import { Component, OnInit, OnDestroy } from '@angular/core';
import { AlertController, LoadingController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';
import { UserProfile, JobType, ActivityLevel, Gender } from '../../models/user.model';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-tab-profile',
  templateUrl: './tab-profile.page.html',
  styleUrls: ['./tab-profile.page.scss'],
})
export class TabProfilePage implements OnInit, OnDestroy {
  profile: UserProfile = {
    firstName: '',
    lastName: '',
    gender: Gender.PreferNotToSay,
    age: 0,
    countryName: '',
    backPainYears: 0,
    jobType: JobType.MostlySitting,
    weeklyActivityLevel: ActivityLevel.Sedentary
  };

  jobTypes = Object.values(JobType);
  activityLevels = Object.values(ActivityLevel);
  genders = Object.values(Gender);
  private userSubscription?: Subscription;

  constructor(
    private authService: AuthService,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private translate: TranslateService
  ) {}

  getGenderTranslationKey(gender: Gender): string {
    return 'GENDER_' + gender.toUpperCase().replace(/\s/g, '_');
  }

  getJobTypeTranslationKey(jobType: JobType): string {
    return 'JOB_TYPE_' + jobType.toUpperCase().replace(/\s/g, '_');
  }

  getActivityLevelTranslationKey(level: ActivityLevel): string {
    return 'ACTIVITY_' + level.toUpperCase().replace(/\s/g, '_');
  }

  async ngOnInit() {
    await this.loadUserData();
    
    this.userSubscription = this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.loadProfileFromUser(user);
      }
    });
  }

  private async loadUserData() {
    await this.authService.checkUser();
    
    const user = this.authService.getCurrentUser();
    if (user) {
      this.loadProfileFromUser(user);
    }
  }

  private loadProfileFromUser(user: any) {
    const getGender = (genderValue: any): Gender => {
      if (!genderValue) return Gender.PreferNotToSay;
      const genderStr = String(genderValue);
      const matchedGender = Object.values(Gender).find(g => g === genderStr);
      return matchedGender || Gender.PreferNotToSay;
    };

    const getJobType = (jobTypeValue: any): JobType => {
      if (!jobTypeValue) return JobType.MostlySitting;
      const jobStr = String(jobTypeValue);
      const matchedJob = Object.values(JobType).find(j => j === jobStr);
      return matchedJob || JobType.MostlySitting;
    };

    const getActivityLevel = (levelValue: any): ActivityLevel => {
      if (!levelValue) return ActivityLevel.Sedentary;
      const levelStr = String(levelValue);
      const matchedLevel = Object.values(ActivityLevel).find(l => l === levelStr);
      return matchedLevel || ActivityLevel.Sedentary;
    };

    this.profile = {
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      gender: getGender(user.gender),
      age: user.age || 0,
      countryName: user.countryName || '',
      backPainYears: user.backPainYears || 0,
      jobType: getJobType(user.jobType),
      weeklyActivityLevel: getActivityLevel(user.weeklyActivityLevel)
    };
  }

  ngOnDestroy() {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  async saveProfile() {
    if (!this.profile.firstName || !this.profile.lastName || !this.profile.age || !this.profile.countryName || !this.profile.gender) {
      const alert = await this.alertController.create({
        header: this.translate.instant('ERROR'),
        message: this.translate.instant('PLEASE_FILL_ALL_FIELDS'),
        buttons: ['OK']
      });
      await alert.present();
      return;
    }

    const loading = await this.loadingController.create({
      message: this.translate.instant('SAVING')
    });
    await loading.present();

    try {
      const user = this.authService.getCurrentUser();
      if (!user) throw new Error('User not authenticated');

      await this.authService.updateProfile(user.id, this.profile);
      await loading.dismiss();
      
      const alert = await this.alertController.create({
        header: this.translate.instant('SUCCESS'),
        message: this.translate.instant('PROFILE_UPDATED'),
        buttons: ['OK']
      });
      await alert.present();
    } catch (error: any) {
      await loading.dismiss();
      const alert = await this.alertController.create({
        header: this.translate.instant('ERROR'),
        message: error.message || this.translate.instant('SAVE_FAILED'),
        buttons: ['OK']
      });
      await alert.present();
    }
  }

  async logout() {
    await this.authService.signOut();
  }
}

