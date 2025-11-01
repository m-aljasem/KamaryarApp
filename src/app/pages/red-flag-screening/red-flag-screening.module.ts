import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';

import { RedFlagScreeningPageRoutingModule } from './red-flag-screening-routing.module';
import { RedFlagScreeningPage } from './red-flag-screening.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    RedFlagScreeningPageRoutingModule
  ],
  declarations: [RedFlagScreeningPage]
})
export class RedFlagScreeningPageModule {}

