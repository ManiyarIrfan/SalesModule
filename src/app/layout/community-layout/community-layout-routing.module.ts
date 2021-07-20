import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommunityLayoutComponent } from './community-layout.component';

const routes: Routes = [
    {
        path: '',
        component: CommunityLayoutComponent,
        children: [
            {
                path: 'dashboard',
                loadChildren: () => import('./components/community-dashboard/community-dashboard.module').then(m => m.CommunityDashboardModule)
            }
        ]
    }   
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CommunityLayoutRoutingModule { }
