import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NewProjectsComponent } from './new-projects.component';

const routes: Routes = [
    {
        path: '',
        component: NewProjectsComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class NewProjectsRoutingModule {}
