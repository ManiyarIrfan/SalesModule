import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PaymentStatementRoutingModule } from './payment-statement-routing.module';
import { PaymentStatementComponent } from './payment-statement.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { ModalModule } from 'ngx-bootstrap';
import { PageHeaderModule } from 'src/app/shared/modules/page-header/page-header.module';
import { SharedComponentModule } from 'src/app/shared/components/shared-component.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
    imports: [
        CommonModule,
        PageHeaderModule,
        FormsModule,
        NgbModule,
        NgxPaginationModule,
        PaymentStatementRoutingModule,
        ModalModule,
        SharedComponentModule],
    declarations: [PaymentStatementComponent]
})
export class PaymentStatementModule { }