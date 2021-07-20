import { Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Subscription } from 'rxjs';
import { IChatModel, IUserProfileModel } from 'src/app/shared/models/community/discussion.model';
import { DiscussionService } from 'src/app/shared/services/community/discussion/discussion.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit, OnChanges, OnDestroy {
  public loggedInuserDetails: any = [];
  public chatList: any[] = [];
  public chat: any[] = [];
  public myPosts: any[] = [];
  public userProfileModel: IUserProfileModel = <IUserProfileModel>{};
  public chatModel: IChatModel = <IChatModel>{};
  public tab: string = '';
  public PostTab: string = '';
  public searchPosts: string = '';
  public currentPageId: number;
  public searchText: string = '';
  public ChatType: any;
  public chatHeader: string[] = [];
  public showPostdata: any[] = [];
  public totalList: any[] = [];
  public userProfile: string = '';
  public chatData: any = [] = [];
  public chatDataTemp: any[] = [];
  public GroupList: any[] = [];
  public showPostFlag: boolean;
  public Flag: boolean;
  public InteractionType: string;

  private _unsubscribeAll: Array<Subscription> = [];

  @Input() ProfileTab: string;
  @Output() HomeTab = new EventEmitter<string>();
  @Output() sendGroupData = new EventEmitter<string>();

  @ViewChild('scrollMe', { static: false }) private myScrollContainer: ElementRef;

  constructor(
    private _interaction: DiscussionService,
    private _snackbar: MatSnackBar) { }

  ngOnInit() {
    this.loggedInuserDetails = JSON.parse(localStorage.getItem('LoggedinUser'));
    if (this.loggedInuserDetails !== null) {
      this.userProfileModel = this.loggedInuserDetails;
      this.userProfile = (this.loggedInuserDetails.ProfilePic !== null) ? this.loggedInuserDetails.ProfilePic : 'https://industrydev.blob.core.windows.net/industrydev/Documents/Master/man.png';
    } else {
      this.userProfile = 'https://industrydev.blob.core.windows.net/industrydev/Documents/Master/man.png';
    }
    this.PostTab = 'list';
    this.getChatMessages();
    this.getMyPosts();
    this.getGroupsDetails();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.ProfileTab && this.ProfileTab) {
      if (this.ProfileTab !== '') {
        this.tab = this.ProfileTab;
      }
    }
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch (err) { }
  }

  selectedTab = (Action) => {
    this.tab = Action;
  }

  selectChatType = (Action) => {
    this.ChatType = Action;
  }

  goHome = () => {
    this.HomeTab.emit('Home');
  }
  // get group detailas
  getGroupsDetails = () => {
    const getGrupsSub = this._interaction.getGroups(this.loggedInuserDetails, { Input: 'Search' })
      .subscribe((response) => { this.GroupList = response['data'][0]; });
    this._unsubscribeAll.push(getGrupsSub);
  }


  startChat = (Action, userDetails) => {
    switch (Action) {
      case 'New':
        this.chatModel = userDetails;
        this.chatModel.ProfilePic = userDetails.ProfilePic;
        this.chatModel.UserName = userDetails.FullName;
        this.chatModel.SendToUserId = userDetails.UserId;
        this.chatData = this.chatHeader = [];
        break;
      case 'Recent':
        this.chatModel.UserName = userDetails.UserName;
        this.chatModel.ProfilePic = userDetails.ProfilePic;
        this.chatModel.SendToUserId = userDetails.SendToUserId;
        this.chatModel.SendByUserId = userDetails.SendByUserId;
        this.chatModel.Input = 'getChats';
        this.getChatMessages();
        break;
      case 'Group':
        this.getGroupDetails(userDetails.GroupId);
        this.chatModel.UserName = userDetails.GroupName;
        this.chatModel.ProfilePic = userDetails.GroupProfilePic
        this.chatModel.SendToUserId = userDetails.GroupId;
        // this.SelectedGroup = items;
        this.sendGroupData.emit(userDetails.GroupName);
        break;
    }
    this.chatHeader = [];
    this.InteractionType = (Action === 'Group') ? 'Group' : 'Chat';
  }

  // get selected Group Details  
  getGroupDetails = (id) => {
    let TempData = [];
    TempData['GroupId'] = id;
    TempData['Input'] = 'SelectById';
    const subGetDetails = this._interaction.getGroups(this.loggedInuserDetails, TempData)
      .subscribe((res) => {
        var copyData = res["data"][2].slice();
        this.chatData = copyData.reverse();
        this.scrollToBottom();
        // const setIsReadSub = this._interaction.insertInseraction(this.loggedInuserDetails, { SendToUserId: id, InteractionType: 'Group', IsRead: 0 })
        //   .subscribe((response) => {
        //     if (response && response['data']) {
        //       if (this.InteractionType === 'Chat') {
        //         this.chatData = this.getChatFormat(response["data"]);
        //         this.chatHeader = Object.keys(this.chatData);
        //       } else {
        //         var copyData = response["data"].slice();
        //         this.chatData = copyData.reverse();
        //       }
        //       this.chatModel.SendMessage = '';
        //       this.scrollToBottom();
        //     }
        //   });
      });
    this._unsubscribeAll.push(subGetDetails);
  }


  // Send Msg or Reply msg
  sendMessage = (dataa) => {
    dataa['SendToUserId'] = this.chatModel.SendToUserId !== this.loggedInuserDetails.UserId ? this.chatModel.SendToUserId : this.chatModel.SendByUserId;
    dataa['InteractionType'] = this.InteractionType;
    dataa['IsRead'] = true;
    const sendmsg = this._interaction.insertInseraction(this.loggedInuserDetails, dataa)
      .subscribe((response) => {
        if (response && response['data']) {
          if (this.InteractionType === 'Chat') {
            this.chatData = this.getChatFormat(response["data"]);
            this.chatHeader = Object.keys(this.chatData);
          } else {
            var copyData = response["data"].slice();
            this.chatData = copyData.reverse();
          }
          this.chatModel.SendMessage = '';
          this.scrollToBottom();
          this.getChatMessages();
        }
      });
    this._unsubscribeAll.push(sendmsg);
  }

  // get chat msg
  getChatMessages = () => {
    let tempData = [];
    if (this.chatModel['Input'] === 'getChats') {
      tempData['SendToUserId'] = this.chatModel.SendToUserId !== this.loggedInuserDetails.UserId ? this.chatModel.SendToUserId : this.chatModel.SendByUserId;
      tempData['Input'] = this.chatModel.Input;
    } else {
      tempData['Input'] = 'getList';
    }
    const getchats = this._interaction.getInteractions(this.loggedInuserDetails, tempData)
      .subscribe((items) => {
        if (items && items['data']) {
          switch (tempData['Input']) {
            case 'getList':
              let SortedData = [];
              const CuruserName = this.loggedInuserDetails.Firstname + ' ' + this.loggedInuserDetails.LastName;
              let Temp = items['data'].filter(x => x.UserName !== CuruserName);

              Temp.map(c => { if (c.UserName !== null && c.UserName !== '') { SortedData.push(c); } });
              this.chatList = Array.from(SortedData.reduce((m, t) => m.set(t.UserName, t), new Map()).values());
              break;
            case 'getChats':
              this.chatData = this.chatHeader = [];
              if (this.InteractionType === 'Chat') {
                this.chatData = this.getChatFormat(items["data"]);
                this.chatHeader = Object.keys(this.chatData);
              } else {
                var copyData = items["data"].slice();
                this.chatData = copyData.reverse();
              }
              break;
          }
          this.scrollToBottom();
        }
      });
    this._unsubscribeAll.push(getchats);
  }

  // formatted chat history data
  getChatFormat = (dataa) => {
    let ResponseData = [], TempData = [];
    var copyData = dataa.slice();
    ResponseData = copyData.reverse();
    TempData = ResponseData && ResponseData.reduce((r, a) => {
      r[new Date(a.CreatedOn).toLocaleDateString()] =
        [...r[new Date(a.CreatedOn).toLocaleDateString()] || [], a];
      return r;
    }, {});
    return TempData;
  }

  // Get post as per login
  getMyPosts = () => {
    const getpost = this._interaction.getDiscussions({ Input: 'Search', EntityId: this.loggedInuserDetails.EntityId })
      .subscribe((response) => {
        if (response && response['data'][0]) {
          response['data'][0].map((element) => {
            this.myPosts.push({
              Subject: element.Subject,
              Message: element.Message,
              CreatedOn: element.CreatedOn,
              CreatedBy: element.CreatedBy,
              shortMessage: element.Message ? element.Message.slice(0, 80) : '',
              Usertype: element.Usertype,
              UserName: element.UserName,
              Likes: element.Likes,
              Views: element.Views,
              Dislikes: element.Dislikes,
              Id: element.Id,
              Timeelapsed: element.Timeelapsed,
              IsPinned: element.IsPinned,
            })
          })
        }
      });
    this._unsubscribeAll.push(getpost)
  }

  viewPostDetails = (item) => {
    this.showPostdata = Array.of(item);
    this.showPostFlag = !this.showPostFlag;
  }
  // Enter Click
  enterClick = (event, searchText) => {
    if (event.keyCode == 13) {
      this.sendMessage(searchText);
    }
  }

  // search user details
  search = (searchdata) => {
    const getsearchdetails = this._interaction.getUserDetails(this.loggedInuserDetails, searchdata)
      .subscribe((response) => {
        if (response && response['data']) {
          this.totalList = response['data'].filter(c => c.UserId !== this.loggedInuserDetails.UserId);
          this.Flag = (this.totalList.length === 0) ? true : false;
        } else {
          this._snackbar.open('No data found', 'CLose', { duration: 3000 })
        }
      });
    this._unsubscribeAll.push(getsearchdetails);
  }

  // unique id corresponding to the item
  trackByFn(item) {
    return item.id;
  }

  ngOnDestroy() {
    this._unsubscribeAll.map((item) => { item.unsubscribe(); })
  }
}
