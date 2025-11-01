import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';

import { LanguageSelectPageRoutingModule } from './language-select-routing.module';
import { LanguageSelectPage } from './language-select.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    LanguageSelectPageRoutingModule
  ],
  declarations: [LanguageSelectPage]
})
export class LanguageSelectPageModule {}

