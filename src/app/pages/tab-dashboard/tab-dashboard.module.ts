import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { TabDashboardPageRoutingModule } from './tab-dashboard-routing.module';
import { TabDashboardPage } from './tab-dashboard.page';
import { ChartComponent } from '../../components/chart/chart.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    TabDashboardPageRoutingModule,
    ChartComponent
  ],
  declarations: [TabDashboardPage]
})
export class TabDashboardPageModule {}

