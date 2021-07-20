import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CroTrainingComponent } from './cro-training.component';

const routes: Routes = [
    {
        path: '',
        component: CroTrainingComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CroTrainingRoutingModule {}
