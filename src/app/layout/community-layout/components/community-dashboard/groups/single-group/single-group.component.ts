import { AfterViewChecked, Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { DiscussionService } from 'src/app/shared/services/community/discussion/discussion.service';

@Component({
  selector: 'app-single-group',
  templateUrl: './single-group.component.html',
  styleUrls: ['./single-group.component.scss']
})
export class SingleGroupComponent implements OnInit, OnChanges, AfterViewChecked, OnDestroy {
  public SelectedGroup: any[] = [];
  public GroupDetails: any[] = [];
  public loggedInuserDetails: any[];
  public UserDetails: any[] = [];
  public ChatDetails: any[] = [];
  public ChatMessage: string = '';
  public searchPosts: string = '';
  public GroupList: any[] = [];

  @Input() selectedData: any[] = [];
  @Output() ifNoData = new EventEmitter<boolean>();
  @Output() sendGroupData = new EventEmitter<string>();
  @ViewChild('scrollMe', { static: false }) private myScrollContainer: ElementRef;

  private _unsubscribeAll: Array<Subscription> = [];

  constructor(private _discussionService: DiscussionService) { }

  ngOnInit() {
    this.loggedInuserDetails = JSON.parse(localStorage.getItem('LoggedinUser'));
    this.getGroups()
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch (err) { }
  }

  ngOnChanges(currentChanges: SimpleChanges) {
    this.loggedInuserDetails = JSON.parse(localStorage.getItem('LoggedinUser'));
    if (currentChanges.selectedData && this.selectedData && this.selectedData !== null) {
      if (this.selectedData.length === 0) {
        this.ifNoData.emit(true);
      } else {
        this.SelectedGroup = this.selectedData as any;
        this.getGroupDetails(this.SelectedGroup['GroupId']);
      }
    } else {
      this.ifNoData.emit(true);
    }
  }

  // get selected Group Details  
  getGroupDetails = (id) => {
    let TempData = [];
    TempData['GroupId'] = id;
    TempData['Input'] = 'SelectById';
    const subGetDetails = this._discussionService.getGroups(this.loggedInuserDetails, TempData)
      .subscribe((res) => {
        this.GroupDetails = res['data'][0];
        this.UserDetails = res['data'][1];
        var copyData = res["data"][2].slice();
        this.ChatDetails = copyData.reverse();
      });
    this._unsubscribeAll.push(subGetDetails);
  }

  //*****  on Enter Click *****//
  enterClick = (event, searchText) => {
    if (event.keyCode == 13) {
      this.sendMessage(searchText);
    }
  }
  // Send Msg or Reply msg
  sendMessage = (ChatMessage) => {
    let TempData = [];
    TempData['SendToUserId'] = this.SelectedGroup['GroupId'];
    TempData['InteractionType'] = 'Group';
    TempData['SendMessage'] = ChatMessage;
    TempData['IsRead'] = true;
    const sendmsg = this._discussionService.insertInseraction(this.loggedInuserDetails, TempData)
      .subscribe((response) => {
        if (response && response['data']) {
          var copyData = response["data"].slice();
          this.ChatDetails = copyData.reverse();
          this.ChatMessage = '';
        }
      });
    this._unsubscribeAll.push(sendmsg);
  }

  // get group detailas
  getGroups = () => {
    const getGrupsSub = this._discussionService.getGroups(this.loggedInuserDetails, { Input: 'Search' })
      .subscribe((response) => { this.GroupList = response['data'][0]; });
    this._unsubscribeAll.push(getGrupsSub);
  }

  // view selected group and reply
  viewGroup = (items) => {
    this.getGroupDetails(items.GroupId);
    this.SelectedGroup = items;
    this.sendGroupData.emit(items.GroupName);
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
