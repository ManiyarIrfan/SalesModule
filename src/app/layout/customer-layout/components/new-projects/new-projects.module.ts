import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NewProjectsRoutingModule } from './new-projects-routing.module';
import { NewProjectsComponent } from './new-projects.component';
import { ModalModule } from "ngx-bootstrap";
import { NgxPaginationModule } from 'ngx-pagination';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { PageHeaderModule } from 'src/app/shared/modules/page-header/page-header.module';
import { SubprojectDetailsComponent } from './subproject-details/subproject-details.component';
import { MaterialModule } from 'src/app/material-module';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { CustAggregationComponent } from './cust-aggregation/cust-aggregation.component';
import { ArchitectDetailsComponent } from './architect-details/architect-details.component';
import { BarRatingModule } from "ngx-bar-rating";
import { InteractDetailsComponent } from './interact-details/interact-details.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
    imports: [CommonModule,
        PageHeaderModule,
        CarouselModule.forRoot(),
        NewProjectsRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        NgxPaginationModule,
        ModalModule.forRoot(),
        MDBBootstrapModule.forRoot(),
        MaterialModule,
        BarRatingModule,
        NgbModule],

    declarations: [
        NewProjectsComponent,
        SubprojectDetailsComponent,
        CustAggregationComponent,
        ArchitectDetailsComponent,
        InteractDetailsComponent],
    exports: []
})
export class NewProjectsModule { }
