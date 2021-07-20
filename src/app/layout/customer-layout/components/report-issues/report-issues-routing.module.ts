import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { reportissuesComponent } from './report-issues.component';

const routes: Routes = [
    {
        path: '',
        component:reportissuesComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class reportissuesRoutingModule {}
