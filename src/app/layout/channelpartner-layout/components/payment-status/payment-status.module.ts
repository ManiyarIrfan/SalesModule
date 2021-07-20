import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { paymentstatusRoutingModule } from './payment-status-routing.module';
import { paymentstatusComponent } from './payment-status.component';
import { PageHeaderModule } from 'src/app/shared/modules/page-header/page-header.module';

@NgModule({
    imports: [CommonModule,
        PageHeaderModule,
        NgxPaginationModule,
        paymentstatusRoutingModule,
        FormsModule],
    declarations: [paymentstatusComponent]
})
export class paymentstatusModule { }
