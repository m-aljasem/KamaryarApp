import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { TabLogPageRoutingModule } from './tab-log-routing.module';
import { TabLogPage } from './tab-log.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    TabLogPageRoutingModule
  ],
  declarations: [TabLogPage]
})
export class TabLogPageModule {}

