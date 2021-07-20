import { Component, OnDestroy, OnInit, ElementRef, ViewChild, Output, EventEmitter, Input } from '@angular/core';
import { Router } from '@angular/router';
import { of, Subscription } from 'rxjs';
import { ChipColor, INewGroupModel } from 'src/app/shared/models/community/discussion.model';
import { DiscussionService } from 'src/app/shared/services/community/discussion/discussion.service';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { FileAttachment, Metadata } from 'src/app/shared/components/file-upload/file-attachment.model';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material';
import { ModalDirective } from 'ngx-bootstrap';
import { DomSanitizer } from '@angular/platform-browser';


@Component({
  selector: 'app-new-group',
  templateUrl: './new-group.component.html',
  styleUrls: ['./new-group.component.scss']
})
export class NewGroupComponent implements OnInit, OnDestroy {
  public newGroupModel: INewGroupModel = <INewGroupModel>{}
  public loggedInuserDetails: any[] = [];
  public ProjectsNames: any[] = [];
  public ProfilePic: string = '';
  // public UserList: any[] = [];
  public FinalUserList: any[] = [];
  public messageRes: string[] = [];
  public FinalDocList: object[] = [];
  public AddedDocList: object[] = [];
  public viewImg: any;

  public visible = true;
  public selectable = true;
  public removable = true;
  public separatorKeysCodes: number[] = [ENTER, COMMA];
  public userCtrl = new FormControl();
  public filteredUsers: Observable<string[]>;

  // public metadata: Metadata[] = [];
  // public multiple;
  // public text: string;
  // public inputMetadata = [];
  // public disabled: boolean
  public inputFiles: FileAttachment[] = [];
  public UploadDone: boolean;
  public disableButton: boolean;

  // public FinalUserList: string[] = ['Lemon'];

  @ViewChild('userdetails', { static: false }) userdetails: ElementRef<HTMLInputElement>;
  @ViewChild('auto', { static: false }) matAutocomplete: MatAutocomplete;
  @ViewChild('ViewDocModel', { static: false }) public ViewDocModel: ModalDirective;

  private _unsubscribeAll: Array<Subscription> = [];

  constructor(
    private _router: Router,
    // private _http: HttpClient,
    // private _sanitizer: DomSanitizer,
    private _discussionService: DiscussionService,
    private _snackbar: MatSnackBar) { }

  ngOnInit() {
    this.loggedInuserDetails = JSON.parse(localStorage.getItem('LoggedinUser'));
    if (this.loggedInuserDetails === null) {
      this._router.navigate(['/login'], { queryParams: { flag: true } });
    }
    this.getProjectsNames();
    this.FinalUserList = [{ FullName: this.loggedInuserDetails['Firstname'] + ' ' + this.loggedInuserDetails['LastName'] }];
  }

  addUser(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    if ((value || '').trim()) { this.FinalUserList.push(value.trim()); }

    // Reset the input value
    if (input) { input.value = ''; }
    this.userCtrl.setValue(null);
  }

  removeUser(fruit: string): void {
    const index = this.FinalUserList.indexOf(fruit);

    if (index >= 0) { this.FinalUserList.splice(index, 1); }
  }

  selectedUsers(event: MatAutocompleteSelectedEvent): void {
    this.FinalUserList.push(event.option.value);
    this.userdetails.nativeElement.value = '';
    this.userCtrl.setValue(null);
  }

  getProjectsNames = () => {
    const getproj = this._discussionService.getProjects(this.loggedInuserDetails)
      .subscribe((response) => { if (response && response['data']) { this.ProjectsNames = response['data']; } });
    this._unsubscribeAll.push(getproj);
  }

  // search user details
  search = (searchdata, value) => {
    if (value.indexOf(' ') >= 0) {
      const getsearchdetails = this._discussionService.getUserDetails(this.loggedInuserDetails, value)
        .subscribe((response) => {
          if (response && response['data']) {
            this.filteredUsers = this.userCtrl.valueChanges.pipe(startWith(null),
              map((item: string | null) => item ? null : response['data'].slice()));
          } else {
            this._snackbar.open('No data found', 'CLose', { duration: 3000 })
          }
        });
      this._unsubscribeAll.push(getsearchdetails);
    }
  }

  // view uploaded docs
  viewDocFile = (data) => {
    const TempExtension = data.Extension ? data.Extension : data.DocExtension;
    let Extendata = ['png', 'PNG', 'jpeg', 'jpg', 'JPG', 'JPEG']
    if (Extendata.find(c => TempExtension.includes(c))) {
      this.ViewDocModel.show();
      this.viewImg = data.DocUrl;
    }
  }

  insertGroup = (Input) => {
    let FinalData = [];
    FinalData['Input'] = Input;
    this.disableButton = true;
    FinalData['ProjectId'] = this.newGroupModel.ProjectId;
    FinalData['GroupName'] = this.newGroupModel.GroupName;
    FinalData['RecipientsId'] = this.FinalUserList.map((item) => item.UserId).join(',');
    const insertgroupSub = this._discussionService.insertgroup(this.loggedInuserDetails, FinalData, this.inputFiles)
      .subscribe((response) => {
        if (response && response['successful'] === true) {
          this.messageRes['msg'] = 'Your New Group is Created';
          this.messageRes['css'] = 'text-success';
          this.newGroupModel = <INewGroupModel>{};
          this.FinalUserList = [];
          this.inputFiles = [];
          this.UploadDone = true;
          this.disableButton = false;
        } else {
          this.messageRes['msg'] = 'Your Group created failed';
          this.messageRes['css'] = 'text-danger';
        }
      });
    this._unsubscribeAll.push(insertgroupSub);
  }

  receiveimage = ($event) => {
    this.inputFiles = $event;
  }

  // unique id corresponding to the item
  trackByFn(item) {
    return item.id;
  }

  ngOnDestroy() {
    this._unsubscribeAll.map((item) => item.unsubscribe());
  }
}