import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReportsRoutingModule } from './reports-routing.module';
import { ReportsComponent } from './reports.component';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PageHeaderModule } from 'src/app/shared/modules/page-header/page-header.module';
import { SharedComponentModule } from 'src/app/shared/components/shared-component.module';
import { ChartsModule } from 'src/app/shared/charts-components/charts.module';
@NgModule({
  imports: [
    CommonModule,
    ReportsRoutingModule,
    PageHeaderModule,
    FormsModule,
    ReactiveFormsModule,
    SharedComponentModule,
    NgxDaterangepickerMd,
    NgxPaginationModule,
    ChartsModule,
    NgbModule
  ],
  declarations: [ReportsComponent]
})
export class ReportsModule { }
