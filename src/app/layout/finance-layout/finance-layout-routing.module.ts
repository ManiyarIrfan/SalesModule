import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FinanceLayoutComponent } from './finance-layout.component';
import { PropertyComponent } from './property/property.component';
import { SupportTicketComponent } from './support-ticket/support-ticket.component';


const routes: Routes = [
  {
    path: '',
    component: FinanceLayoutComponent,    
  },
  {
    path: 'home',
    component: DashboardComponent
  },
  {
    path: 'property',
    component: PropertyComponent
  },
  {
    path: 'supportticket',
    component: SupportTicketComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FinanceLayoutRoutingModule { }
