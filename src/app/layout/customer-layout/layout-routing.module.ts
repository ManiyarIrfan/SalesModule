import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './layout.component';
import { AuthGuard } from 'src/app/shared/guard/auth.guard';
import { IdeaModuleComponent } from 'src/app/shared/components/idea-module/idea-module.component';
import { CustomerFeedbackComponent } from 'src/app/shared/components/customer-feedback/customer-feedback.component';
const routes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        children: [
            { path: 'view-profile', loadChildren: () => import('./components/view-profile/view-profile.module').then(m => m.ViewProfileModule), canActivate: [AuthGuard] },
            { path: 'payment-schedule', loadChildren: () => import('./components/payment-schedule/payment-schedule.module').then(m => m.PaymentScheduleModule), canActivate: [AuthGuard] },
            { path: 'report-issues', loadChildren: () => import('./components/report-issues/report-issues.module').then(m => m.reportissuesModule), canActivate: [AuthGuard] },
            { path: 'referral-generation', loadChildren: () => import('./components/referral-generation/referral-generation.module').then(m => m.ReferralGenerationModule), canActivate: [AuthGuard] },
            { path: 'referral-status', loadChildren: () => import('./components/referral-status/referral-status.module').then(m => m.ReferralStatusModule), canActivate: [AuthGuard] },
            { path: 'project-status', loadChildren: () => import('./components/project-status/project-status.module').then(m => m.ProjectStatusModule), canActivate: [AuthGuard] },
            { path: 'new-Projects', loadChildren: () => import('./components/new-projects/new-projects.module').then(m => m.NewProjectsModule), canActivate: [AuthGuard] },
            { path: 'my-property', loadChildren: () => import('./components/new-projects/new-projects.module').then(m => m.NewProjectsModule), canActivate: [AuthGuard] },
            { path: 'idea-module', component: IdeaModuleComponent, canActivate: [AuthGuard] },
            { path: 'customerfeedback', component: CustomerFeedbackComponent, canActivate: [AuthGuard] }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LayoutRoutingModule { }
