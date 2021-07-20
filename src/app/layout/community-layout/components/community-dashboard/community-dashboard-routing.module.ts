import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommunityDashboardComponent } from './community-dashboard.component';

const routes: Routes = [
  {
    path: '',
    component: CommunityDashboardComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CommunityDashboardRoutingModule { }
