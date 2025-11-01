import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VASPage } from './vas.page';

const routes: Routes = [
  {
    path: '',
    component: VASPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VASPageRoutingModule {}

