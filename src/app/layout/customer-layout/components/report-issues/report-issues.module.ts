import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { reportissuesRoutingModule } from './report-issues-routing.module';
import { reportissuesComponent } from './report-issues.component';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { PageHeaderModule } from 'src/app/shared/modules/page-header/page-header.module';
// import { ModalModule } from 'angular-bootstrap-md';
import { SharedComponentModule } from 'src/app/shared/components/shared-component.module';
import { ModalModule } from 'ngx-bootstrap';
import { MaterialModule } from 'src/app/material-module';
import { FormsModule } from '@angular/forms';

@NgModule({
    imports: [CommonModule,
        PageHeaderModule,
        NgxPaginationModule,
        reportissuesRoutingModule,
        FormsModule,
        ModalModule,
        CarouselModule.forRoot(),
        SharedComponentModule,
        MaterialModule],
    declarations: [reportissuesComponent]
})
export class reportissuesModule { }
