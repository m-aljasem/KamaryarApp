import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabLogPage } from './tab-log.page';

const routes: Routes = [
  {
    path: '',
    component: TabLogPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabLogPageRoutingModule {}

