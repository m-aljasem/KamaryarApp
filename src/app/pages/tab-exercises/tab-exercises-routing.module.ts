import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabExercisesPage } from './tab-exercises.page';

const routes: Routes = [
  {
    path: '',
    component: TabExercisesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabExercisesPageRoutingModule {}

