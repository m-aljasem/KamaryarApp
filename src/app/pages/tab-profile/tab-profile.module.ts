import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { TabProfilePageRoutingModule } from './tab-profile-routing.module';
import { TabProfilePage } from './tab-profile.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    TabProfilePageRoutingModule
  ],
  declarations: [TabProfilePage]
})
export class TabProfilePageModule {}

