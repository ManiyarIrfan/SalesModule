import { NgModule } from "@angular/core";
import { CommonModule } from '@angular/common';
import { RouterModule } from "@angular/router";
import { NgbDropdownModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CarouselModule, ModalModule } from 'ngx-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FbLikeComponent } from './fb-like.component';
import { GooglePlusComponent } from './google-plus.component';
import { LinkedInShareComponent } from './linkedin-share.component';
import { PinItComponent } from './pin-it.component';
import { TweetComponent } from './tweet.component';
import { AllDiscussionComponent } from '../community-dashboard/discussions/all-discussion/all-discussion.component';
import { NewDiscussionComponent } from '../community-dashboard/discussions/new-discussion/new-discussion.component';
import { SingleDiscussionComponent } from '../community-dashboard/discussions/single-discussion/single-discussion.component';
import { AllGroupsComponent } from '../community-dashboard/groups/all-groups/all-groups.component';
import { NewGroupComponent } from '../community-dashboard/groups/new-group/new-group.component';
import { SingleGroupComponent } from '../community-dashboard/groups/single-group/single-group.component';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { CKEditorModule } from 'ng2-ckeditor';
import { NgxPaginationModule } from 'ngx-pagination';
import { MaterialModule } from 'src/app/material-module';
import { SharedComponentModule } from 'src/app/shared/components/shared-component.module';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        ModalModule.forRoot(),        
        ReactiveFormsModule,
        SharedComponentModule,
        NgbDropdownModule,
        MaterialModule,
        CarouselModule,
        FormsModule,
        CKEditorModule,
        NgbModule,
        Ng2SearchPipeModule,
        NgxPaginationModule,
        MDBBootstrapModule,
    ],
    declarations: [
        FbLikeComponent,
        GooglePlusComponent,
        TweetComponent,
        PinItComponent,
        LinkedInShareComponent,
        AllGroupsComponent,
        NewGroupComponent,
        SingleGroupComponent,
        SingleDiscussionComponent,
        AllDiscussionComponent,
        NewDiscussionComponent,
    ],
    exports: [
        FbLikeComponent,
        GooglePlusComponent,
        TweetComponent,
        PinItComponent,
        LinkedInShareComponent,
        AllGroupsComponent,
        NewGroupComponent,
        SingleGroupComponent,
        SingleDiscussionComponent,
        AllDiscussionComponent,
        NewDiscussionComponent,
    ]
})

export class SocialSharedModule { }