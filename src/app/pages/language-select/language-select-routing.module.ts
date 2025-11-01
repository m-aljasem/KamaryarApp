import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LanguageSelectPage } from './language-select.page';

const routes: Routes = [
  {
    path: '',
    component: LanguageSelectPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LanguageSelectPageRoutingModule {}

