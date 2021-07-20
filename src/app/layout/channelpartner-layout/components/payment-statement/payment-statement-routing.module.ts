import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PaymentStatementComponent } from './payment-statement.component';

const routes: Routes = [
    {
        path: '',
        component: PaymentStatementComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PaymentStatementRoutingModule {}
