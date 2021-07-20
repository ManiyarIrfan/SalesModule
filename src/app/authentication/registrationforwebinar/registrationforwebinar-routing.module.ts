import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RegistrationforwebinarComponent } from './registrationforwebinar.component';

const routes: Routes = [
  {
    path: '',
    component: RegistrationforwebinarComponent
  },
  {
    path: 'getevents/:eventName',
    component: RegistrationforwebinarComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RegistrationforwebinarRoutingModule { }
