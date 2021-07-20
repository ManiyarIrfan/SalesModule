import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PaymentScheduleRoutingModule } from './payment-schedule-routing.module';
import { PaymentScheduleComponent } from './payment-schedule.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { PageHeaderModule } from 'src/app/shared/modules/page-header/page-header.module';
import { MaterialModule } from 'src/app/material-module';
@NgModule({
    imports: [CommonModule,
        PageHeaderModule,
        FormsModule,
        NgxPaginationModule,
        PaymentScheduleRoutingModule,
        MaterialModule],
    declarations: [PaymentScheduleComponent]
})
export class PaymentScheduleModule { }


