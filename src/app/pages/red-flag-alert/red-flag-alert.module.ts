import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';

import { RedFlagAlertPageRoutingModule } from './red-flag-alert-routing.module';
import { RedFlagAlertPage } from './red-flag-alert.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    RedFlagAlertPageRoutingModule
  ],
  declarations: [RedFlagAlertPage]
})
export class RedFlagAlertPageModule {}

