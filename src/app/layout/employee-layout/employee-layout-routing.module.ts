import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EmployeeLayoutComponent } from './employee-layout.component';
import { AuthGuard } from 'src/app/shared/guard/auth.guard';

const routes: Routes = [
    {
        path: '',
        component: EmployeeLayoutComponent,
        children:
            [
                { path: 'home', redirectTo: 'employee-dashboard' },           
                { path: 'employee-dashboard', loadChildren: () => import('./employee-dashboard/employee-dashboard.module').then(m => m.EmployeeDashboardModule), canActivate: [AuthGuard] },
            ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class EmployeeLayoutRoutingModule { }
