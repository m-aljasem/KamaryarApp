import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PainLogPage } from './pain-log.page';

const routes: Routes = [
  {
    path: '',
    component: PainLogPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PainLogPageRoutingModule {}

