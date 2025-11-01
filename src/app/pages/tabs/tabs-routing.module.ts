import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'about',
        loadChildren: () => import('../tab-about/tab-about.module').then(m => m.TabAboutPageModule)
      },
      {
        path: 'profile',
        loadChildren: () => import('../tab-profile/tab-profile.module').then(m => m.TabProfilePageModule)
      },
      {
        path: 'dashboard-tab',
        loadChildren: () => import('../tab-dashboard/tab-dashboard.module').then(m => m.TabDashboardPageModule)
      },
      {
        path: 'log',
        loadChildren: () => import('../tab-log/tab-log.module').then(m => m.TabLogPageModule)
      },
      {
        path: 'exercises',
        loadChildren: () => import('../tab-exercises/tab-exercises.module').then(m => m.TabExercisesPageModule)
      },
      {
        path: '',
        redirectTo: 'dashboard-tab',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}

