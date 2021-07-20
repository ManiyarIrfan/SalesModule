import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalModule } from "ngx-bootstrap";
import { SignupRoutingModule } from './signup-routing.module';
import { SignupComponent } from './signup.component';
import { SharedComponentModule } from 'src/app/shared/components/shared-component.module';
import { DeviceDetectorModule } from 'ngx-device-detector';

@NgModule({
  imports: [
    CommonModule,
    SignupRoutingModule,
    FormsModule,
    SharedComponentModule,
    ModalModule.forRoot(),
    DeviceDetectorModule.forRoot(),
  ],
  declarations: [SignupComponent]
})
export class SignupModule { }
