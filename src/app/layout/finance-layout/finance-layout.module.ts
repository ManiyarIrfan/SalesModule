import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FinanceLayoutRoutingModule } from './finance-layout-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PropertyComponent } from './property/property.component';
import { SharedComponentModule } from 'src/app/shared/components/shared-component.module';
import { FinanceLayoutComponent } from './finance-layout.component';
import { SupportTicketComponent } from './support-ticket/support-ticket.component';
import { ProfileComponent } from './profile/profile.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SidemenuComponent } from './sidemenu/sidemenu.component';
import { DocumentsComponent } from './documents/documents.component';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MaterialModule } from 'src/app/material-module';
import { CreateTicketComponent } from './support-ticket/create-ticket/create-ticket.component';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { ModalModule } from 'ngx-bootstrap';
import { UploaddocComponent } from './documents/uploaddoc/uploaddoc.component';

@NgModule({
  declarations: [
    DashboardComponent,
    FinanceLayoutComponent,
    PropertyComponent,
    SupportTicketComponent,
    SidemenuComponent,
    ProfileComponent,
    DocumentsComponent,
    CreateTicketComponent,
    UploaddocComponent],
  imports: [
    CommonModule,
    FinanceLayoutRoutingModule,
    SharedComponentModule,
    NgxPaginationModule,
    Ng2SearchPipeModule,
    FormsModule,
    ReactiveFormsModule,
    CarouselModule.forRoot(),
    NgbModule,
    MaterialModule,
    ModalModule,
    MDBBootstrapModule.forRoot(),
  ]
})
export class FinanceLayoutModule { }
