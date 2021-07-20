import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { MyNetworkRoutingModule } from './my-network-routing.module';
import { MyNetworkComponent } from './my-network.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PageHeaderModule } from 'src/app/shared/modules/page-header/page-header.module';
import { SharedComponentModule } from 'src/app/shared/components/shared-component.module';

@NgModule({
    imports: [CommonModule,
        MyNetworkRoutingModule,
        FormsModule,
        PageHeaderModule,
        NgbModule,
        NgxPaginationModule,
        SharedComponentModule],
    declarations: [MyNetworkComponent]
})
export class MyNetworkModule { }
