import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbDropdownModule, } from '@ng-bootstrap/ng-bootstrap';
import { ChannelpartnerLayoutRoutingModule } from './channelpartner-layout-routing.module';
import { ChannelpartnerLayoutComponent } from './channelpartner-layout.component';
import { SharedComponentModule } from 'src/app/shared/components/shared-component.module';
import { ModalModule } from 'ngx-bootstrap';
import { MaterialModule } from 'src/app/material-module';
import { CarouselModule } from 'ngx-bootstrap/carousel';
@NgModule({
    imports: [
        CommonModule,
        ChannelpartnerLayoutRoutingModule,
        SharedComponentModule,
        NgbDropdownModule,
        ModalModule,
        MaterialModule,
        CarouselModule
    ],
    declarations: [ChannelpartnerLayoutComponent]
})
export class ChannelpartnerLayoutModule { }
