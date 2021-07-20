import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommunityDashboardRoutingModule } from './community-dashboard-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbDropdownModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { CKEditorModule } from 'ng2-ckeditor';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { ModalModule, CarouselModule } from 'ngx-bootstrap';
import { NgxPaginationModule } from 'ngx-pagination';
import { MaterialModule } from 'src/app/material-module';
import { SharedComponentModule } from 'src/app/shared/components/shared-component.module';
import { SocialSharedModule } from '../shared-Components/social-shared.module';

@NgModule({
  declarations: [// CommunityDashboardComponent 
  ],
  imports: [
    CommonModule,
    CommunityDashboardRoutingModule,
    SharedComponentModule,
    NgbDropdownModule,
    ModalModule,
    MaterialModule,
    CarouselModule,
    FormsModule,
    CKEditorModule,
    NgbModule,
    Ng2SearchPipeModule,
    NgxPaginationModule,
    ReactiveFormsModule,
    SocialSharedModule,
    MDBBootstrapModule,
  ]
})
export class CommunityDashboardModule { }
