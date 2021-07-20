import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProjectStatusRoutingModule } from './project-status-routing.module';
import { ProjectStatusComponent } from './project-status.component';
import { ProjectDetailsComponent } from './project-details/project-details.component';
import { ModalModule } from "ngx-bootstrap";
import { NgxPaginationModule } from 'ngx-pagination';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { PageHeaderModule } from 'src/app/shared/modules/page-header/page-header.module';
import { MaterialModule } from 'src/app/material-module';

@NgModule({
    imports: [CommonModule,
        PageHeaderModule,
        CarouselModule.forRoot(),
        ProjectStatusRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        NgxPaginationModule,
        ModalModule.forRoot(),
        MaterialModule
    ],
    declarations: [ProjectStatusComponent, ProjectDetailsComponent],
})
export class ProjectStatusModule { }
