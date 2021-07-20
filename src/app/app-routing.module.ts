import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// import { NotFoundComponent } from './errorComponent/not-found/not-found.component';
import { AuthGuard } from './shared/guard/auth.guard';


const routes: Routes = [
  { path: '', loadChildren: () => import('./authentication/login/login.module').then(m => m.LoginModule), },
  { path: 'login', loadChildren: () => import('./authentication/login/login.module').then(m => m.LoginModule) },
  { path: 'customer', loadChildren: () => import('./layout/customer-layout/layout.module').then(m => m.LayoutModule), canActivate: [AuthGuard] },
  { path: 'employee', loadChildren: () => import('./layout/employee-layout/employee-layout.module').then(m => m.EmployeeLayoutModule), canActivate: [AuthGuard] },
  { path: 'channelpartner', loadChildren: () => import('./layout/channelpartner-layout/channelpartner-layout.module').then(m => m.ChannelpartnerLayoutModule), canActivate: [AuthGuard] },
  { path: 'cro', loadChildren: () => import('./layout/xfactor-layout/xfactor-layout.module').then(m => m.XfactorLayoutModule), canActivate: [AuthGuard] },
  { path: 'signup', loadChildren: () => import('./authentication/signup/signup.module').then(m => m.SignupModule) },
  { path: 'events', loadChildren: () => import('./authentication/registrationforwebinar/registrationforwebinar.module').then(m => m.RegistrationforwebinarModule) },
  // { path: 'error', loadChildren: () => import('./errorComponent/server-error/server-error.module').then(m => m.ServerErrorModule) },
  // { path: 'access-denied', loadChildren: () => import('./errorComponent/access-denied/access-denied.module').then(m => m.AccessDeniedModule) },
  // { path: 'not-found', loadChildren: () => import('./errorComponent/not-found/not-found.module').then(m => m.NotFoundModule) },
  { path: 'community', loadChildren: () => import('./layout/community-layout/community-layout.module').then(m => m.CommunityLayoutModule) },
  { path: 'finance', loadChildren: () => import('./layout/finance-layout/finance-layout.module').then(m => m.FinanceLayoutModule) },
  // { path: '**', loadChildren: () => import('./errorComponent/error-components.module').then(m => m.ErrorComponentsModule) },
  { path: 'errors', loadChildren: () => import('./errorComponent/error-components.module').then(m => m.ErrorComponentsModule) },
  // { path: '**', redirectTo: 'not-found' }
  {
    path: '**',
    redirectTo: 'errors/notFound',
    // component: NotFoundComponent,
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
