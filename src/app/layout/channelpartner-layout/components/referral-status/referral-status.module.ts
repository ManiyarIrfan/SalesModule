import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { ReferralStatusRoutingModule } from './referral-status-routing.module';
import { ReferralStatusComponent } from './referral-status.component';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { PageHeaderModule } from 'src/app/shared/modules/page-header/page-header.module';
import { SharedComponentModule } from 'src/app/shared/components/shared-component.module';
import { ModalModule } from 'ngx-bootstrap';
@NgModule({
    imports: [
        FormsModule,
        CommonModule,
        PageHeaderModule,
        NgxPaginationModule,
        ReferralStatusRoutingModule,
        ModalModule,
        Ng2SearchPipeModule,
        SharedComponentModule
    ],
    declarations: [ReferralStatusComponent]
})
export class ReferralStatusModule { }
