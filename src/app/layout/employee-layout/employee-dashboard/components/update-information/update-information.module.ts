import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { UpdateInformationRoutingModule } from './update-information-routing.module';
import { FormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap';
import { StatModule } from 'src/app/shared/modules/stat/stat.module';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';

@NgModule({
    imports: [StatModule,
        CommonModule,
        UpdateInformationRoutingModule,
        NgbModule,
        FormsModule,
        ModalModule.forRoot(),
        NgxDaterangepickerMd
    ], schemas: [CUSTOM_ELEMENTS_SCHEMA],
    declarations: [],
    bootstrap: []
})
export class UpdateInformationModule { }
