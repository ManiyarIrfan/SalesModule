import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ViewProfileRoutingModule } from './view-profile-routing.module';
import { ViewProfileComponent } from './view-profile.component';
import { ModalModule } from 'ngx-bootstrap';
import { PageHeaderModule } from 'src/app/shared/modules/page-header/page-header.module';
import { StatModule } from 'src/app/shared/modules/stat/stat.module';
import { MaterialModule } from 'src/app/material-module';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedComponentModule } from 'src/app/shared/components/shared-component.module';

@NgModule({
    imports: [StatModule, CommonModule,
        PageHeaderModule,
        FormsModule,
        ModalModule,
        ViewProfileRoutingModule,
        MaterialModule,
        NgxPaginationModule,
        NgbModule,
        SharedComponentModule
    ],
    declarations: [ViewProfileComponent]
})
export class ViewProfileModule { }
