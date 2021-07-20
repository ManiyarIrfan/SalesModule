import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReferralGenerationComponent } from './referral-generation.component';

const routes: Routes = [
    {
        path: '',
        component: ReferralGenerationComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ReferralGenerationRoutingModule { }
