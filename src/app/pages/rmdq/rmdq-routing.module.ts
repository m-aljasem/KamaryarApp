import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RMDQPage } from './rmdq.page';

const routes: Routes = [
  {
    path: '',
    component: RMDQPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RMDQPageRoutingModule {}

