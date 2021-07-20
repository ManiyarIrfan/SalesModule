import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { EmployeeLayoutRoutingModule } from './employee-layout-routing.module';
import { EmployeeLayoutComponent } from './employee-layout.component';
import { SharedComponentModule } from 'src/app/shared/components/shared-component.module';

@NgModule({
    imports: [
        CommonModule,
        EmployeeLayoutRoutingModule,
        SharedComponentModule,
        NgbDropdownModule
    ],
    declarations: [EmployeeLayoutComponent]
})
export class EmployeeLayoutModule { }
