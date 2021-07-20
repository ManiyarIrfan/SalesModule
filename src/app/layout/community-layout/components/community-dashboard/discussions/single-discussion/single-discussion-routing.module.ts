import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SingleDiscussionComponent } from './single-discussion.component';

const routes: Routes = [
  {
    path: 'getDetails/:Id',
    component: SingleDiscussionComponent
  },
  {
    path: '',
    component: SingleDiscussionComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SingleDiscussionRoutingModule { }
