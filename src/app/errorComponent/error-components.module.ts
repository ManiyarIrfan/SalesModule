import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ErrorComponentsRoutingModule } from './error-components-routing.module';
import { AccessDeniedComponent } from './access-denied/access-denied.component';
import { ServerErrorComponent } from './server-error/server-error.component';
import { NotFoundComponent } from './not-found/not-found.component';


@NgModule({
  declarations: [AccessDeniedComponent,NotFoundComponent,ServerErrorComponent],
  imports: [
    CommonModule,
    ErrorComponentsRoutingModule
  ]
})
export class ErrorComponentsModule { }
