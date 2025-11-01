import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';

import { PainLogPageRoutingModule } from './pain-log-routing.module';
import { PainLogPage } from './pain-log.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    PainLogPageRoutingModule
  ],
  declarations: [PainLogPage]
})
export class PainLogPageModule {}

