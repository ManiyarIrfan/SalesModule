import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { XfactorLayoutComponent } from './xfactor-layout.component';
import { AuthGuard } from 'src/app/shared/guard/auth.guard';
import { IdeaModuleComponent } from 'src/app/shared/components/idea-module/idea-module.component';

const routes: Routes = [
    {
        path: '',
        component: XfactorLayoutComponent,
        children: [
            { path: 'home', redirectTo: 'view-profile-cro' },
            { path: 'view-profile-cro', loadChildren: () => import('../channelpartner-layout/components/view-profile/view-profile.module').then(m => m.ViewProfileModule), canActivate: [AuthGuard] },
            { path: 'referral-generation-cro', loadChildren: () => import('../channelpartner-layout/components/referral-generation/referral-generation.module').then(m => m.ReferralGenerationModule), canActivate: [AuthGuard] },
            { path: 'referral-status-cro', loadChildren: () => import('../channelpartner-layout/components/referral-status/referral-status.module').then(m => m.ReferralStatusModule), canActivate: [AuthGuard] },
            { path: 'payment-statement-cro', loadChildren: () => import('../channelpartner-layout/components/payment-statement/payment-statement.module').then(m => m.PaymentStatementModule), canActivate: [AuthGuard] },
            { path: 'payment-status-cro', loadChildren: () => import('../channelpartner-layout/components/payment-status/payment-status.module').then(m => m.paymentstatusModule), canActivate: [AuthGuard] },
            { path: 'report-issues-cro', loadChildren: () => import('../channelpartner-layout/components/report-issues/report-issues.module').then(m => m.reportissuesModule), canActivate: [AuthGuard] },
            { path: 'project-status-cro', loadChildren: () => import('../channelpartner-layout/components/project-status/project-status.module').then(m => m.ProjectStatusModule), canActivate: [AuthGuard] },
            { path: 'app-reports', loadChildren: () => import('../channelpartner-layout/components/reports/reports.module').then(m => m.ReportsModule), canActivate: [AuthGuard] },
            { path: 'idea-module', component: IdeaModuleComponent, canActivate: [AuthGuard] },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class XfactorLayoutRoutingModule { }
