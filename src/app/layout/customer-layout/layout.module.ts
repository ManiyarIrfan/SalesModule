import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { LayoutRoutingModule } from './layout-routing.module';
import { LayoutComponent } from './layout.component';
import { ModalModule } from "ngx-bootstrap";
import { SharedComponentModule } from 'src/app/shared/components/shared-component.module';
import { MaterialModule } from 'src/app/material-module';

@NgModule({
    imports: [
        CommonModule,
        LayoutRoutingModule,
        SharedComponentModule,
        NgbDropdownModule,
        ModalModule.forRoot(),
        MaterialModule
    ],
    declarations: [LayoutComponent],
    exports: [
        ModalModule
    ]
})
export class LayoutModule { }
