import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PaymentScheduleComponent } from './payment-schedule.component';

const routes: Routes = [
    {
        path: '',
        component: PaymentScheduleComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PaymentScheduleRoutingModule {}
