import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { DiscussionService } from 'src/app/shared/services/community/discussion/discussion.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { SharedService } from 'src/app/shared/services/shared/shared.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Location } from '@angular/common';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-community-dashboard',
  templateUrl: './community-dashboard.component.html',
  styleUrls: ['./community-dashboard.component.scss']
})
export class CommunityDashboardComponent implements OnInit, OnDestroy {
  public dashboardModel: string[] = [];
  public loggedInuserDetails: any[] = [];
  public viewDetails: boolean;
  public newDiscussion: boolean;
  public Input: string = '';
  public EmittedPostSubject: string = '';
  public DisId: string = '';
  public Type: string = '';
  public headerTitle = '';
  public allDiscussions: object[] = [];
  public selectedData: string[] = [];
  public TopDiscussions: object[] = [];
  public TopProjectWiseDiscussions: object[] = [];
  public TopGroupsWiseDiscussions: object[] = [];
  public TempDiscussion: any = [] = [];
  public discussionData: any = [] = [];

  @Input() logout: boolean;
  @Output() OpenTabEvent: EventEmitter<string> = new EventEmitter<string>();

  private _unsubscribeAll: Array<Subscription> = [];

  constructor(
    private _router: Router,
    private _location: Location,
    private _spinner: NgxSpinnerService,
    private _sharedService: SharedService,
    private _discService: DiscussionService,
    private _actRoute: ActivatedRoute) { }

  ngOnInit() {
    let Action = this._actRoute.snapshot.queryParams["Action"];
    let Type = this._actRoute.snapshot.queryParams["Type"];
    this.DisId = this._actRoute.snapshot.queryParams["id"];
    if (Action && Type && this.DisId) {
      if (Action && Type) {
        this.getPostData(this.DisId)
      }
    } else {
      this.Input = 'Dashboard';
      this._actRoute.queryParams.subscribe(Items => {
        if (Items && Items['Action']) {
          if (Items['Action'] !== '') {
            this.Input = Items['Action'];
            this.Type = Items['Type'];
            if (this.Type === 'Projects') { this.openAnotherTab() }
            if (this.Input !== 'Home') {
              this.viewDetails = true;
            } else {
              this.viewDetails = false;
            }
            // if some shared data is present
            if (JSON.parse(localStorage.getItem('LoggedinUser')) !== null) {
              this._sharedService.getDiscussionData.subscribe((item) => {
                if (item && item.data && item.data !== null) {
                  this.goToTab(item.Type, item.Action, item.data)
                }
              });
            }
          } else {
            this.viewDetails = false;
            this.Input = '';
          }
        }
      });
      this._sharedService.backtoHome.subscribe((item) => { if (item && item === true) { this.backtoHome(); } });
    }
    this.loggedInuserDetails = JSON.parse(localStorage.getItem('LoggedinUser'));
    this.getAllDiscussion();
    // this.getGroups();
  }

  EmittedData = (subject) => {
    this.headerTitle = subject;
  }

  decryptUsingAES256(decryptString) {
    let _key = CryptoJS.enc.Utf8.parse(decryptString);
    let _iv = CryptoJS.enc.Utf8.parse(decryptString);
    let decrypted
    decrypted = CryptoJS.AES.decrypt(
      decrypted, _key, {
      keySize: 16,
      iv: _iv,
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    }).toString(CryptoJS.enc.Utf8);

    return decrypted;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.logout && this.logout) {
      if (this.logout === true) {
        this.backtoHome();
      }
    }
  }

  // Back to Dashboard
  backtoHome = () => {
    this.viewDetails = false;
    this._location.replaceState("/community");
    this.getAllDiscussion();
  }

  selectedOption = (item) => {
    this.headerTitle = item;
  }

  openAnotherTab = () => {
    this.OpenTabEvent.emit('Projects')
  }

  getPostData = (id) => {
    this._spinner.show();
    this.goToTab('Discussions', 'single', id)
  }

  goToTab = (TabType, ActionDetails, data): void => {
    this.selectedData = data //? data : ActionDetails.data;
    this.Input = ActionDetails.Action ? ActionDetails.Action : ActionDetails;
    this.Type = (TabType !== undefined && TabType !== '') ? TabType : this.Type;
    if (this.Input === 'New') {
      if (JSON.parse(localStorage.getItem('LoggedinUser')) === null) {
        this._router.navigate(['/login'], { queryParams: { flag: true, Action: 'New', Type: TabType } });
      } else {
        this.Input = this.Input;
        this.viewDetails = true;
        this.Type = TabType;
      }
    } else {
      switch (this.Type) {
        case 'Groups':
          switch (this.Input) {
            case 'New':
              this.headerTitle = 'New Group';
              break;
            case 'single':
              this.headerTitle = data && data.GroupName ? data.GroupName : ActionDetails.data.GroupName;
              // insert view count
              // if (JSON.parse(localStorage.getItem('LoggedinUser')) !== null) {
              //   let TempData = [];
              //   TempData['User'] = JSON.parse(localStorage.getItem('LoggedinUser'));
              //   TempData['Input'] = 'SetView';
              //   TempData['DiscussionId'] = this.selectedData['id'];
              //   const unsubInsertView = this._discService.addNewDiscussion(TempData['User'], TempData, []).subscribe();
              //   this._unsubscribeAll.push(unsubInsertView);
              // }
              break;
            case 'allGroups':
              this.headerTitle = `Group's`;
              break;
          }
          break;
        case 'Discussions':
          switch (this.Input) {
            case 'New':
              this.headerTitle = 'New Discussion';
              break;
            case 'single':
              // this.headerTitle = data && data.Subject ? data.Subject : ActionDetails.data.Subject;
              // insert view count
              if (JSON.parse(localStorage.getItem('LoggedinUser')) !== null) {
                let TempData = [];
                TempData['User'] = JSON.parse(localStorage.getItem('LoggedinUser'));
                TempData['Input'] = 'SetView';
                TempData['DiscussionId'] = this.selectedData;
                const unsubInsertView = this._discService.addNewDiscussion(TempData['User'], TempData, []).subscribe();
                this._unsubscribeAll.push(unsubInsertView);
              }
              break;
            case 'allDiscussions':
              this.headerTitle = `Discussion's`;
              break;
          }
          break;
      }

      this.viewDetails = true;
      this._spinner.hide()
      // Remove Selected Discussion topic from suggessions
      if (this.selectedData && this.selectedData['Id']) {
        let spliceData = [];
        Object.assign(spliceData, this.TempDiscussion);
        const index = spliceData.findIndex(x => x['Id'] === this.selectedData['Id']);
        if (index !== -1) {
          spliceData.splice(index, 1)
          this.TopDiscussions = [];
          spliceData.sort((a, b) => b.Views - a.Views).map((c) => { if (this.TopDiscussions.length !== 4) { this.TopDiscussions.push(c) } });
        }
      }
    }
  }

  // shuffle data
  shuffle = (a) => {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  // get top discussions 
  getAllDiscussion = () => {
    let TempData = [];
    TempData['Input'] = 'Search';
    const discussionSub = this._discService.getDiscussions(TempData)
      .subscribe((response) => {
        this.allDiscussions = this.TopDiscussions = [];
        this.TempDiscussion = response['data'][0];
        //  Sort top 4 pinned discussions on dashboard
        let TempData = [];
        TempData = response['data'][0].sort((a, b) => b.IsPinned - a.IsPinned);
        TempData.sort((a, b) => b.Views - a.Views).map((c) => { if (c.IsPinned === true) { if (this.allDiscussions.length !== 4) { this.allDiscussions.push(c) } } })

        // Sort top Views from desc and get top 4 discussions from list
        response['data'][0].sort((a, b) => b.Views - a.Views).map((c) => { if (this.TopDiscussions.length !== 4) { this.TopDiscussions.push(c) } });
        // Project wise Posts Details
        response['data'][0].filter(c => c.ProjectId !== null).map((item) => { if (this.TopProjectWiseDiscussions.length !== 4) { this.TopProjectWiseDiscussions.push(item) } });
        // Groups List 
        response['data'][1].map((item) => { if (this.TopGroupsWiseDiscussions.length !== 4) { this.TopGroupsWiseDiscussions.push(item) } });
      });
    this._unsubscribeAll.push(discussionSub)
  }

  // get formatted data for selected disscussion
  getFormattedData = (data1, data2) => {
    let Tempdata1 = [], Tempdata2 = [], finalData = [];
    data1.map((item) => {
      Tempdata1 = data2.filter(c => c.ChildId === item.DiscussionId)
      Tempdata2.push({
        RepliesData: Tempdata1,
        ChildId: item.ChildId,
        CommentLevel: item.CommentLevel,
        CreatedOn: item.CreatedOn,
        Discussion: item.Discussion,
        DiscussionId: item.DiscussionId,
        EntityId: item.EntityId,
        Likes: item.Likes,
        Dislikes: item.Dislikes,
        ParentId: item.ParentId,
        ReplayBy: item.ReplayBy,
        SubDiscussion: item.SubDiscussion,
        Usertype: item.Usertype,
        Views: item.Views,
        Timeelapsed: item.Timeelapsed,
        Attachments: item.Attachments,
        ProfilePic: item.ProfilePic
      });
    })
    Tempdata2.map(c => { if (c.ChildId === null) { finalData.push(c) } });

    return finalData;
  }

  // unique id corresponding to the item
  trackByFn(item) {
    return item.id;
  }

  ngOnDestroy() {
    for (const item of this._unsubscribeAll) {
      item.unsubscribe();
    }
  }
}
