import { Component, OnDestroy, OnInit, Output } from '@angular/core';
import { DiscussionService } from 'src/app/shared/services/community/discussion/discussion.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-project-community',
  templateUrl: './project-community.component.html',
  styleUrls: ['./project-community.component.scss']
})
export class ProjectCommunityComponent implements OnInit, OnDestroy {
  public loggedInuserDetails: any[] = [];
  public ProjectDetails: any[] = [];

  private _unsubscribeAll: Array<Subscription> = [];

  constructor(
    private discussionService: DiscussionService,
    private _router: Router,
    private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.loggedInuserDetails = JSON.parse(localStorage.getItem('LoggedinUser'));
    // if (this.loggedInuserDetails === null) {
    //   this._router.navigate(['/login'], { queryParams: { flag: true } });
    // }
    if (this.loggedInuserDetails === null) {
      this._router.navigate(['/login'], { queryParams: { flag: true, Action: 'allprojects', Type: 'Projects' } });
      // setTimeout(() => { this._sharedService.setDiscussions(this.selectedData) }, 3000);
    }
    this.getProject();
  }

  getProject = () => {
    const getproj = this.discussionService.getProjects(this.loggedInuserDetails).subscribe((response) => {
      if (response && response['data']) {
        const removedata = ['Common', 'test', 'Test', 'pkb', 'New', 'My Test Project', 'abc', 'My Project', 'AkshayK', 'ABCDEF', 'hgfgh', 'sd']

        response['data'].map((item) => {
          if (!removedata.find(x => item.ProjectName.toLowerCase().includes(x.toLowerCase()))) {
            this.ProjectDetails.push(item)
          }
        })
      }
    });
    this._unsubscribeAll.push(getproj);
  }

  ngOnDestroy() {
    this._unsubscribeAll.map((item) => item.unsubscribe());
  }
}
