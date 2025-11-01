import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';

import { RMDQPageRoutingModule } from './rmdq-routing.module';
import { RMDQPage } from './rmdq.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    RMDQPageRoutingModule
  ],
  declarations: [RMDQPage]
})
export class RMDQPageModule {}

