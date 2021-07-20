import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { paymentstatusComponent } from './payment-status.component';

const routes: Routes = [
    {
        path: '',
        component: paymentstatusComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class paymentstatusRoutingModule {}
