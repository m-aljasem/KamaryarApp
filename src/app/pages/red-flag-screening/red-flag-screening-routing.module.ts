import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RedFlagScreeningPage } from './red-flag-screening.page';

const routes: Routes = [
  {
    path: '',
    component: RedFlagScreeningPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RedFlagScreeningPageRoutingModule {}

