import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbDropdownModule, } from '@ng-bootstrap/ng-bootstrap';
import { CommunityLayoutRoutingModule } from './community-layout-routing.module';
import { SharedComponentModule } from 'src/app/shared/components/shared-component.module';
import { ModalModule } from 'ngx-bootstrap';
import { MaterialModule } from 'src/app/material-module';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CKEditorModule } from 'ng2-ckeditor';
import { NgxPaginationModule } from 'ngx-pagination';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { CustomersCommunityComponent } from './components/customers-community/customers-community.component';
import { EventsCommunityComponent } from './components/events-community/events-community.component';
import { ProjectCommunityComponent } from './components/project-community/project-community.component';
import { PartenersCommunityComponent } from './components/parteners-community/parteners-community.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { CommunityLayoutComponent } from './community-layout.component';
import { CommunityDashboardComponent } from './components/community-dashboard/community-dashboard.component';
import { SocialSharedModule } from './components/shared-Components/social-shared.module';

@NgModule({
    imports: [
        CommonModule,
        CommunityLayoutRoutingModule,
        SharedComponentModule,
        SocialSharedModule,
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
        MDBBootstrapModule,
    ],
    declarations: [
        CommunityLayoutComponent,
        CommunityDashboardComponent,
        ProjectCommunityComponent,
        PartenersCommunityComponent,
        CustomersCommunityComponent,
        EventsCommunityComponent,
        UserProfileComponent      
    ]
})
export class CommunityLayoutModule { }
