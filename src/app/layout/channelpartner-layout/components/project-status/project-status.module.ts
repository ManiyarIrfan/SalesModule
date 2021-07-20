import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { ProjectStatusRoutingModule } from './project-status-routing.module';
import { ProjectStatusComponent } from './project-status.component';
import { ModalModule } from 'ngx-bootstrap';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PageHeaderModule } from 'src/app/shared/modules/page-header/page-header.module';
@NgModule({
    imports: [CommonModule,
        ModalModule,
        PageHeaderModule,
        CarouselModule.forRoot(),
        NgxPaginationModule,
        ProjectStatusRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        NgbModule],
    declarations: [ProjectStatusComponent]
})
export class ProjectStatusModule { }
