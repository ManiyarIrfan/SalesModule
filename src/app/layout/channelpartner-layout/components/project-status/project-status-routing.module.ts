import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProjectStatusComponent } from './project-status.component';

const routes: Routes = [
    {
        path: '',
        component: ProjectStatusComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ProjectStatusRoutingModule {}
