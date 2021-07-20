import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MyNetworkComponent } from './my-network.component';

const routes: Routes = [
    {
        path: '',
        component: MyNetworkComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MyNetworkRoutingModule {}
