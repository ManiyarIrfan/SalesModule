import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DiscussionService } from 'src/app/shared/services/community/discussion/discussion.service';

@Component({
  selector: 'app-all-discussion',
  templateUrl: './all-discussion.component.html',
  styleUrls: ['./all-discussion.component.scss']
})
export class AllDiscussionComponent implements OnInit, OnDestroy {
  public allDiscussions: any[] = [];
  public UserRole: any
  public loggedInuserDetails: any[] = [];
  public currentPageId: number = 0;

  @Output() transterData: EventEmitter<any> = new EventEmitter<any>();

  private _unsubscribeAll: Array<Subscription> = [];

  constructor(
    private _discService: DiscussionService,
    private _router: Router,
    private _snackBar: MatSnackBar) { }

  ngOnInit() {
    if (JSON.parse(localStorage.getItem('LoggedinUser')) !== null) {
      this.loggedInuserDetails = JSON.parse(localStorage.getItem('LoggedinUser'));
      this.UserRole = this.loggedInuserDetails['Role'];
    }
    this.getAllDiscussion();
  }

  goToTab = () => {
    this.transterData.emit({ Action: 'New' });
  }

  getAllDiscussion = () => {
    const unsubAllDis = this._discService.getDiscussions({ Input: 'Search' })
      .subscribe((response) => {
        this.allDiscussions = [];
        let TempData = [];
        TempData = response['data'][0].sort((a, b) => b.Views - a.Views);
        TempData.sort((a, b) => b.IsPinned - a.IsPinned)
          .map(element => {
            this.allDiscussions.push({
              Subject: element.Subject,
              Message: element.Message,
              CreatedOn: element.CreatedOn,
              CreatedBy: element.CreatedBy,
              shortMessage: element.Message ? element.Message.slice(0, 30) : '',
              Usertype: element.Usertype,
              UserName: element.UserName,
              Likes: element.Likes,
              Views: element.Views,
              Dislikes: element.Dislikes,
              Id: element.Id,
              Comments: element.Comments,
              Timeelapsed: element.Timeelapsed,
              IsPinned: element.IsPinned,
              Attachments: element.Attachments
            })
          });
      });
    this._unsubscribeAll.push(unsubAllDis);
  }

  viewDetails = (selectedData) => {
    const data = { data: selectedData['Id'], Action: 'single' }
    this.transterData.emit(data);

    // insert view count
    if (JSON.parse(localStorage.getItem('LoggedinUser')) !== null) {
      let TempData = [];
      TempData['User'] = JSON.parse(localStorage.getItem('LoggedinUser'));
      TempData['Input'] = 'SetView';
      TempData['DiscussionId'] = selectedData.Id;
      const unsubInsertView = this._discService.addNewDiscussion(TempData['User'], TempData, []).subscribe();
      this._unsubscribeAll.push(unsubInsertView);
    }
  }

  // Pin Selected post to Top
  PinPost = (item) => {
    if (JSON.parse(localStorage.getItem('LoggedinUser')) !== null) {
      let TempData = [];
      TempData['DiscussionId'] = item.Id;
      TempData['Input'] = 'SetPinned';
      TempData['IsPinned'] = (item.IsPinned === null) ? true : (item.IsPinned === false) ? true : false;
      const PinPostSub = this._discService.addNewDiscussion(this.loggedInuserDetails, TempData, [])
        .subscribe((response) => {
          if (response && response) {
            const msg = (TempData['IsPinned'] === true) ? 'Pinned' : 'Unpinned';
            this._snackBar.open('Your Discussion is ' + msg, 'Close', { duration: 3000 });
            item.IsPinned = TempData['IsPinned'];
            return item;
          }
        });
      this._unsubscribeAll.push(PinPostSub);
    } else {
      this._router.navigate(['/login'], { queryParams: { flag: true, Action: 'all' } });
    }
  }

  // unique id corresponding to the item
  trackByFn(item) {
    return item.id;
  }

  ngOnDestroy() {
    // for (const item of this._unsubscribeAll) {
    //   item.unsubscribe();
    // }
    this._unsubscribeAll.map((item) => item.unsubscribe());
  }
}
