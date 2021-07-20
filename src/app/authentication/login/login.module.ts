import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login.component';
import { ModalModule } from "ngx-bootstrap";
import { ShowHidePasswordModule } from 'ngx-show-hide-password';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DeviceDetectorModule } from 'ngx-device-detector';

@NgModule({
    imports: [CommonModule,
        LoginRoutingModule,
        FormsModule,
        NgbModule,
        ModalModule.forRoot(),
        DeviceDetectorModule.forRoot(),
        ShowHidePasswordModule],
    declarations: [LoginComponent]
})
export class LoginModule { }
