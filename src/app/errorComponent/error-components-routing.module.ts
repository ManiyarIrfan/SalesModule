import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AccessDeniedComponent } from './access-denied/access-denied.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { ServerErrorComponent } from './server-error/server-error.component';


const routes: Routes = [{
  path: '',
  children: [
    {
      path: 'accessDenied',
      component: AccessDeniedComponent,
    },
    {
      path: 'serverError',
      component: ServerErrorComponent,
    },
    {
      path: 'notFound',
      component: NotFoundComponent,
    }
  ]
}];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ErrorComponentsRoutingModule { }
