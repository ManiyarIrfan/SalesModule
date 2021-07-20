import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReferralStatusComponent } from './referral-status.component';

const routes: Routes = [
    {
        path: '',
        component: ReferralStatusComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ReferralStatusRoutingModule { }
