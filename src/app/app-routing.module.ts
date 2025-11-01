import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { OnboardingGuard } from './guards/onboarding.guard';
import { RedFlagGuard } from './guards/red-flag.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'language-select',
    pathMatch: 'full'
  },
  {
    path: 'language-select',
    loadChildren: () => import('./pages/language-select/language-select.module').then(m => m.LanguageSelectPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./pages/register/register.module').then(m => m.RegisterPageModule)
  },
  {
    path: 'profile-setup',
    loadChildren: () => import('./pages/profile-setup/profile-setup.module').then(m => m.ProfileSetupPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'red-flag',
    loadChildren: () => import('./pages/red-flag-screening/red-flag-screening.module').then(m => m.RedFlagScreeningPageModule),
    canActivate: [AuthGuard, OnboardingGuard]
  },
  {
    path: 'red-flag-alert',
    loadChildren: () => import('./pages/red-flag-alert/red-flag-alert.module').then(m => m.RedFlagAlertPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'pain-localization',
    loadChildren: () => import('./pages/pain-localization/pain-localization.module').then(m => m.PainLocalizationPageModule),
    canActivate: [AuthGuard, OnboardingGuard, RedFlagGuard]
  },
  {
    path: 'start-back',
    loadChildren: () => import('./pages/start-back/start-back.module').then(m => m.StartBackPageModule),
    canActivate: [AuthGuard, OnboardingGuard, RedFlagGuard]
  },
  {
    path: 'rmdq',
    loadChildren: () => import('./pages/rmdq/rmdq.module').then(m => m.RMDQPageModule),
    canActivate: [AuthGuard, OnboardingGuard, RedFlagGuard]
  },
  {
    path: 'vas',
    loadChildren: () => import('./pages/vas/vas.module').then(m => m.VASPageModule),
    canActivate: [AuthGuard, OnboardingGuard, RedFlagGuard]
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./pages/dashboard/dashboard.module').then(m => m.DashboardPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'tabs',
    loadChildren: () => import('./pages/tabs/tabs.module').then(m => m.TabsPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'weekly-plan',
    loadChildren: () => import('./pages/weekly-plan/weekly-plan.module').then(m => m.WeeklyPlanPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'pain-log',
    loadChildren: () => import('./pages/pain-log/pain-log.module').then(m => m.PainLogPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'activity-detail',
    loadChildren: () => import('./pages/activity-detail/activity-detail.module').then(m => m.ActivityDetailPageModule),
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: false })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}

