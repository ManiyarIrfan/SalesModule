import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChannelpartnerLayoutComponent } from './channelpartner-layout.component';
import { AuthGuard } from 'src/app/shared/guard/auth.guard';
import { IdeaModuleComponent } from 'src/app/shared/components/idea-module/idea-module.component';
const routes: Routes = [
    {
        path: '',
        component: ChannelpartnerLayoutComponent,
        children: [
            { path: 'home', redirectTo: 'view-profile-cp' },
            { path: 'view-profile-cp', loadChildren: () => import('./components/view-profile/view-profile.module').then(m => m.ViewProfileModule) },
            { path: 'payment-statement-cp', loadChildren: () => import('./components/payment-statement/payment-statement.module').then(m => m.PaymentStatementModule), canActivate: [AuthGuard] },
            { path: 'payment-status-cp', loadChildren: () => import('./components/payment-status/payment-status.module').then(m => m.paymentstatusModule), canActivate: [AuthGuard] },
            { path: 'report-issues-cp', loadChildren: () => import('./components/report-issues/report-issues.module').then(m => m.reportissuesModule), canActivate: [AuthGuard] },
            { path: 'referral-generation-cp', loadChildren: () => import('./components/referral-generation/referral-generation.module').then(m => m.ReferralGenerationModule), canActivate: [AuthGuard] },
            { path: 'referral-status-cp', loadChildren: () => import('./components/referral-status/referral-status.module').then(m => m.ReferralStatusModule), canActivate: [AuthGuard] },
            { path: 'project-status-cp', loadChildren: () => import('./components/project-status/project-status.module').then(m => m.ProjectStatusModule), canActivate: [AuthGuard] },
            { path: 'app-reports', loadChildren: () => import('./components/reports/reports.module').then(m => m.ReportsModule), canActivate: [AuthGuard] },
            { path: 'new-Projects', loadChildren: () => import('../customer-layout/components/new-projects/new-projects.module').then(m => m.NewProjectsModule), canActivate: [AuthGuard] },
            { path: 'my-network', loadChildren: () => import('./components/my-network/my-network.module').then(m => m.MyNetworkModule), canActivate: [AuthGuard] },
            { path: 'cro-training', loadChildren: () => import('./components/cro-training/cro-training.module').then(m => m.CroTrainingModule), canActivate: [AuthGuard] },
            // { path: 'community', loadChildren: () => import('../community-layout/community-layout.module').then(m => m.CommunityLayoutModule) },
            { path: 'idea-module', component: IdeaModuleComponent, canActivate: [AuthGuard] },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ChannelpartnerLayoutRoutingModule { }
