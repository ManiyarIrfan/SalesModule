import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DiscussionService } from 'src/app/shared/services/community/discussion/discussion.service';

@Component({
  selector: 'app-all-groups',
  templateUrl: './all-groups.component.html',
  styleUrls: ['./all-groups.component.scss']
})
export class AllGroupsComponent implements OnInit, OnDestroy {
  public loggedInuserDetails: any[] = [];
  public GroupList: any[] = [];
  public searchPosts: string = '';
  public PostTab: string = '';

  @Output() transterData: EventEmitter<object> = new EventEmitter<object>();

  private _unsubscribeAll: Array<Subscription> = [];

  constructor(
    private _router: Router,
    private _discussionService: DiscussionService,) { }

  ngOnInit() {
    this.loggedInuserDetails = JSON.parse(localStorage.getItem('LoggedinUser'));
    if (this.loggedInuserDetails === null) {
      this._router.navigate(['/login'], { queryParams: { flag: true, Action: 'allGroups', Type: 'Groups' } });
    } else {
      this.getGroups();
    }
    this.PostTab = 'grid';
  }

  goToTab = () => {
    this.transterData.emit({ Action: 'New' });
  }

  // view group details
  viewGroup = (selectedData) => {
    const data = { data: selectedData, Action: 'single' }
    this.transterData.emit(data);
  }

  // get groups
  getGroups = () => {
    const getGrupsSub = this._discussionService.getGroups(this.loggedInuserDetails, { Input: 'Search' })
      .subscribe((response) => { this.GroupList = response['data'][0]; });
    this._unsubscribeAll.push(getGrupsSub);
  }

  // unique id corresponding to the item
  trackByFn(item) {
    return item.id;
  }

  ngOnDestroy() {
    this._unsubscribeAll.map((item) => item.unsubscribe());
    this._unsubscribeAll = [];
  }
}
