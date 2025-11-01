import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';

import { StartBackPageRoutingModule } from './start-back-routing.module';
import { StartBackPage } from './start-back.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    StartBackPageRoutingModule
  ],
  declarations: [StartBackPage]
})
export class StartBackPageModule {}

