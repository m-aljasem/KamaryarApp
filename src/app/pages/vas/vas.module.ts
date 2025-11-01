import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';

import { VASPageRoutingModule } from './vas-routing.module';
import { VASPage } from './vas.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    VASPageRoutingModule
  ],
  declarations: [VASPage]
})
export class VASPageModule {}

