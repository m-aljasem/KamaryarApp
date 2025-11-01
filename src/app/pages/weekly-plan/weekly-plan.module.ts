import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';

import { WeeklyPlanPageRoutingModule } from './weekly-plan-routing.module';
import { WeeklyPlanPage } from './weekly-plan.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    WeeklyPlanPageRoutingModule
  ],
  declarations: [WeeklyPlanPage]
})
export class WeeklyPlanPageModule {}

