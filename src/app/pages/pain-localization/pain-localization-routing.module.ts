import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PainLocalizationPage } from './pain-localization.page';

const routes: Routes = [
  {
    path: '',
    component: PainLocalizationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PainLocalizationPageRoutingModule {}

