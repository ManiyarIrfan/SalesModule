import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { CroTrainingRoutingModule } from './cro-training-routing.module';
import { CroTrainingComponent } from './cro-training.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PageHeaderModule } from 'src/app/shared/modules/page-header/page-header.module';
import { SharedComponentModule } from 'src/app/shared/components/shared-component.module';

@NgModule({
    imports: [CommonModule,
        CroTrainingRoutingModule,
        FormsModule,
        PageHeaderModule,
        NgbModule,
        NgxPaginationModule,
        SharedComponentModule],
    declarations: [CroTrainingComponent]
})
export class CroTrainingModule { }
