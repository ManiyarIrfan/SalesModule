import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UpdateInformationComponent } from './update-information.component';

const routes: Routes = [
    {
        path: '',
        component: UpdateInformationComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class UpdateInformationRoutingModule {}
