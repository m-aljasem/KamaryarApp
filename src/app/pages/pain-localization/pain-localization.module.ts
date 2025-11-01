import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';

import { PainLocalizationPageRoutingModule } from './pain-localization-routing.module';
import { PainLocalizationPage } from './pain-localization.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    PainLocalizationPageRoutingModule
  ],
  declarations: [PainLocalizationPage]
})
export class PainLocalizationPageModule {}

