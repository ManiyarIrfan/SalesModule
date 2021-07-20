import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { XfactorLayoutRoutingModule } from './xfactor-layout-routing.module';
import { XfactorLayoutComponent } from './xfactor-layout.component';
import { SharedComponentModule } from 'src/app/shared/components/shared-component.module';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { ModalModule } from 'ngx-bootstrap';
@NgModule({
    imports: [
        CommonModule,
        XfactorLayoutRoutingModule,
        SharedComponentModule,
        NgbDropdownModule,
        CarouselModule,
        ModalModule
    ],
    declarations: [XfactorLayoutComponent],
})
export class XfactorLayoutModule { }
