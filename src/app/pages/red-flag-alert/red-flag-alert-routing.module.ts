import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RedFlagAlertPage } from './red-flag-alert.page';

const routes: Routes = [
  {
    path: '',
    component: RedFlagAlertPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RedFlagAlertPageRoutingModule {}

