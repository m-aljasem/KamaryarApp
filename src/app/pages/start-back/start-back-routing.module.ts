import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StartBackPage } from './start-back.page';

const routes: Routes = [
  {
    path: '',
    component: StartBackPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StartBackPageRoutingModule {}

