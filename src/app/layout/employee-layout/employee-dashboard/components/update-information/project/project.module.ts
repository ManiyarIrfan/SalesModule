import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectRoutingModule } from './project-routing.module';
import { FormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap';
@NgModule({
    imports: [CommonModule,
        ModalModule.forRoot(),
        ProjectRoutingModule,
        CommonModule,
        FormsModule,
        ModalModule.forRoot(),
    ],
    declarations: []
})
export class ProjectModule { 
}
