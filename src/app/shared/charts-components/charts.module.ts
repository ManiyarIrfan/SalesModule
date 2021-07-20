import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalModule } from 'ngx-bootstrap';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { SplitBarChartComponent } from '../charts-components/split-bar-chart/split-bar-chart.component';
import { PieChartComponent } from '../charts-components/pie-chart/pie-chart.component';
import { GroupBarChartComponent } from '../charts-components/group-bar-chart/group-bar-chart.component';
import { AmbarChartsComponent } from '../charts-components/ambar-charts/ambar-charts.component';
import { ClustredChartsComponent } from '../charts-components/clustred-charts/clustred-charts.component';


@NgModule({
  imports: [
    CommonModule,
    NgxPaginationModule,
    ModalModule,
    FormsModule
  ],
  declarations: [
    SplitBarChartComponent,
    PieChartComponent,
    GroupBarChartComponent,
    AmbarChartsComponent,
    ClustredChartsComponent
  ],
  exports: [
    SplitBarChartComponent,
    PieChartComponent,
    GroupBarChartComponent,
    AmbarChartsComponent,
    ClustredChartsComponent
  ]
})
export class ChartsModule { }
