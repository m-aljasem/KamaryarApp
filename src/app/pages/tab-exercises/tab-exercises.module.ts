import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { TabExercisesPageRoutingModule } from './tab-exercises-routing.module';
import { TabExercisesPage } from './tab-exercises.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    TabExercisesPageRoutingModule
  ],
  declarations: [TabExercisesPage]
})
export class TabExercisesPageModule {}

