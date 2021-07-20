import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { reportissuesRoutingModule } from './report-issues-routing.module';
import { reportissuesComponent } from './report-issues.component';
import { ModalModule } from 'ngx-bootstrap';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { PageHeaderModule } from 'src/app/shared/modules/page-header/page-header.module';
import { SharedComponentModule } from 'src/app/shared/components/shared-component.module';
@NgModule({
    imports: [CommonModule,
        PageHeaderModule,
        reportissuesRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        NgxPaginationModule,
        ModalModule,
        CarouselModule.forRoot(),
        SharedComponentModule],
    declarations: [reportissuesComponent]
})
export class reportissuesModule { }
