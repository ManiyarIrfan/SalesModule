import { Component, OnInit, Input, OnChanges, SimpleChanges, EventEmitter, Output, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { ICurrentSelectedDiscussion } from 'src/app/shared/models/community/discussion.model';
import { DiscussionService } from 'src/app/shared/services/community/discussion/discussion.service';
import { SharedService } from 'src/app/shared/services/shared/shared.service';
import * as CryptoJS from 'crypto-js';
@Component({
  selector: 'app-single-discussion',
  templateUrl: './single-discussion.component.html',
  styleUrls: ['./single-discussion.component.scss']
})
export class SingleDiscussionComponent implements OnInit, OnDestroy {
  public currentSelectedDiscussion: ICurrentSelectedDiscussion = <ICurrentSelectedDiscussion>{};
  public loggedInuserDetails: any[] = [];
  public GiveCommentFlag: boolean;
  public DiscussionMaster: any[] = [];
  public DiscussionTransaction: any[] = [];
  public Flag: boolean;
  public discussionReplay: string = '';
  public currentURL: string;
  private tokenFromUI: string = "0123456789123456";
  public encrypted: any = "";
  public decrypted: string; public request: string;
  public responce: string;

  @Input() selectedData: any[] = [];
  @Output() ifNoData = new EventEmitter<boolean>();
  @Output() PostSubject = new EventEmitter<string>();

  private _unsubscribeAll: Array<Subscription> = [];

  constructor(
    private _router: Router,
    private _location: Location,
    private _spinner: NgxSpinnerService,
    private _sharedService: SharedService,
    private _discussionService: DiscussionService) {
    // this.encryptUsingAES256();
  }

  ngOnInit() {
    this._spinner.show();
    this.loggedInuserDetails = JSON.parse(localStorage.getItem('LoggedinUser'));
    this._sharedService.sharePostData.subscribe((item) => {
      if (item && item.selectedData) {
        this.getDetails(this.selectedData);
      }
    });
  }

  ngOnChanges(currentChanges: SimpleChanges) {
    this._spinner.show();
    if (currentChanges.selectedData && this.selectedData && this.selectedData !== null) {
      this.getDetails(this.selectedData);
    } else {
      this.ifNoData.emit(true);
    }
  }

  // check if user is logged in or not..if not then route to login screen
  CheckLoggedIn = () => {
    if (this.loggedInuserDetails === null) {
      this._router.navigate(['/login'], { queryParams: { flag: true, Action: 'single', Type: 'Discussions' } });
      setTimeout(() => { this._sharedService.setDiscussions(this.selectedData) }, 1000);
    }
  }


  // give comment check is user is logged in
  giveComment = () => {
    if (this.loggedInuserDetails === null) {
      this._router.navigate(['/login'], { queryParams: { flag: true, Action: 'single', Type: 'Discussions' } });
      this.GiveCommentFlag = true;
    } else {
      this.GiveCommentFlag = true;
    }
  }

  // get selected discussion details
  getDetails = (id) => {
    let TempData = [];
    TempData['DiscussionId'] = id;
    TempData['Input'] = 'SelectById';
    const subGetDetails = this._discussionService.getDiscussions(TempData)
      .subscribe((res) => {
        if (res && res['exception'] !== "No Data Found") {
          this.currentSelectedDiscussion = res['data'][0][0];
          this.DiscussionTransaction = this.getFormattedData(res['data'][1], res['data'][1]);
          let Test = 'community?Action=';
          let OriginalURL = 'single&Type=Discussions&id=' + this.currentSelectedDiscussion['Id'];
          // this.currentURL = Test + this.encryptUsingAES256(OriginalURL)
          this.PostSubject.emit(this.currentSelectedDiscussion['Subject'])
          this._location.replaceState(Test + OriginalURL);

          //console.log(baseURL + this.currentURL);
          if (this.currentSelectedDiscussion !== null) {
            this._spinner.hide();
          }
        }
      });
    this._unsubscribeAll.push(subGetDetails);
  }

  // insert Responce
  giveResponse = (input, data, item) => {
    // this._spinner.show();
    this.loggedInuserDetails = JSON.parse(localStorage.getItem('LoggedinUser'));
    if (this.loggedInuserDetails === null) {
      this._router.navigate(['/login'], { queryParams: { flag: true, Action: 'single', Type: 'Discussions' } });
      setTimeout(() => { this._sharedService.setDiscussions(this.selectedData) }, 1000);
    } else {
      let tempData = [];
      tempData['Input'] = input;
      if (data !== null) {
        if (input === 'GiveSubReplay' || input === 'GiveSubLike' || input === 'GiveSubDislikes') {
          tempData['Discussion'] = data.SubDiscussion;
          tempData['ParentId'] = data.ParentId;
          tempData['ChildId'] = data.DiscussionId;
          tempData['IsRead'] = 1;
        } else {
          tempData['Discussion'] = data.Discussion || this.discussionReplay;
        }
      }
      tempData['IsRead'] = 1;
      tempData['DiscussionId'] = this.currentSelectedDiscussion['Id'];
      const subresponseAPI = this._discussionService.addNewDiscussion(this.loggedInuserDetails, tempData, [])
        .subscribe((response) => {
          if (response && response['successful'] && response['data'].length > 0) {
            switch (tempData['Input']) {
              case 'GiveReplay':
                this.DiscussionTransaction = this.getFormattedData(response['data'], response['data']);
                this.GiveCommentFlag = false;
                this.currentSelectedDiscussion['Discussion'] = this.discussionReplay = '';
                this.currentSelectedDiscussion['Comments'] = this.currentSelectedDiscussion['Comments'] + 1;
                break;
              case 'GiveSubReplay':
              case 'GiveSubLike':
              case 'GiveSubDislikes':
                this.DiscussionTransaction = this.getFormattedData(response['data'], response['data']);
                break;
              case 'GiveLike':
              case 'GiveDislikes':
                response['data'].map((element) => {
                  this.currentSelectedDiscussion['Subject'] = element.Subject;
                  this.currentSelectedDiscussion['Message'] = element.Message;
                  this.currentSelectedDiscussion['CreatedOn'] = element.CreatedOn;
                  this.currentSelectedDiscussion['CreatedBy'] = element.CreatedBy;
                  this.currentSelectedDiscussion['shortMessage'] = element.Message ? element.Message.slice(0, 30) : '';
                  this.currentSelectedDiscussion['Usertype'] = element.Usertype;
                  this.currentSelectedDiscussion['UserName'] = element.UserName;
                  this.currentSelectedDiscussion['Likes'] = element.Likes;
                  this.currentSelectedDiscussion['Dislikes'] = element.Dislikes;
                  this.currentSelectedDiscussion['Views'] = element.Views;
                  this.currentSelectedDiscussion['Id'] = element.Id;
                  this.currentSelectedDiscussion['Timeelapsed'] = element.Timeelapsed;
                  this.currentSelectedDiscussion['Attachments'] = element.Attachments;
                  this.currentSelectedDiscussion['Comments'] = element.Comments;
                  this.currentSelectedDiscussion['ProfilePic'] = element.ProfilePic;
                });
                break;
            }
            // setTimeout(() => { this._spinner.hide(); }, 1000);
          }
        });
      this._unsubscribeAll.push(subresponseAPI);
    }
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

  encryptUsingAES256(string) {
    let _key = CryptoJS.enc.Utf8.parse(this.tokenFromUI);
    let _iv = CryptoJS.enc.Utf8.parse(this.tokenFromUI);
    let encrypted = CryptoJS.AES.encrypt(
      JSON.stringify(string), _key, {
      keySize: 16,
      iv: _iv,
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    });
    this.encrypted = encrypted.toString();
    return this.encrypted;
  }
  decryptUsingAES256() {
    let _key = CryptoJS.enc.Utf8.parse(this.tokenFromUI);
    let _iv = CryptoJS.enc.Utf8.parse(this.tokenFromUI);

    this.decrypted = CryptoJS.AES.decrypt(
      this.encrypted, _key, {
      keySize: 16,
      iv: _iv,
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    }).toString(CryptoJS.enc.Utf8);
  }

  viewFile = (url) => {
    window.open(url.split('=')[1])
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
