import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReferralStatusRoutingModule } from './referral-status-routing.module';
import { ReferralStatusComponent } from './referral-status.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { PageHeaderModule } from 'src/app/shared/modules/page-header/page-header.module';
import { MaterialModule } from 'src/app/material-module';
@NgModule({
    imports: [FormsModule,
        CommonModule,
        PageHeaderModule,
        ReferralStatusRoutingModule,
        NgxPaginationModule,
        MaterialModule],
    declarations: [ReferralStatusComponent]
})
export class ReferralStatusModule { }
