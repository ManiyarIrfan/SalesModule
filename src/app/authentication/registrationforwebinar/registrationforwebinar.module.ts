import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegistrationforwebinarRoutingModule } from './registrationforwebinar-routing.module';
import { RegistrationforwebinarComponent } from './registrationforwebinar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { MaterialModule } from 'src/app/material-module';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { ModalModule } from 'ngx-bootstrap';


@NgModule({
  declarations: [RegistrationforwebinarComponent],
  imports: [
    CommonModule,
    RegistrationforwebinarRoutingModule,
    FormsModule,
    MDBBootstrapModule.forRoot(),
    MaterialModule,
    NgxPaginationModule,
    ReactiveFormsModule,
    ModalModule.forRoot(),

  ]
})
export class RegistrationforwebinarModule { }
