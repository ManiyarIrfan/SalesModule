import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { DiscussionService } from 'src/app/shared/services/community/discussion/discussion.service';
import { INewDiscussionModel } from 'src/app/shared/models/community/discussion.model';
import { Router } from '@angular/router';
import { FileAttachment, FileUploadModel, Metadata } from 'src/app/shared/components/file-upload/file-attachment.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-new-discussion',
  templateUrl: './new-discussion.component.html',
  styleUrls: ['./new-discussion.component.scss'],

})
export class NewDiscussionComponent implements OnInit, OnDestroy {
  public ckeConfig: any;
  public loggedInuserDetails: any[] = [];
  public newDiscussionModel: INewDiscussionModel = <INewDiscussionModel>{};
  public metadata: Metadata[] = [];
  public multiple;
  public text: string;
  public inputMetadata = [];
  public disabled: boolean
  public inputFiles: FileAttachment[] = [];
  public messageRes: string[] = [];
  public ProjectsNames: any[] = [];
  public UploadDone: boolean;
  public  disableButton: boolean;

  private _unsubscribeAll: Array<Subscription> = [];

  constructor(
    private discussionService: DiscussionService,
    private _router: Router) { }

  ngOnInit() {
    this.loggedInuserDetails = JSON.parse(localStorage.getItem('LoggedinUser'));
    if (this.loggedInuserDetails === null) {
      this._router.navigate(['/login'], { queryParams: { flag: true } });
    }
    this.ckeConfig = {
      allowedContent: true,
      extraPlugins: 'divarea',
      forcePasteAsPlainText: false,
      removePlugins: 'elementspath',
      removeButtons: 'Save',
      toolbarGroups: [
        { "name": "basicstyles", "groups": ["basicstyles"] },
        { "name": "paragraph", "groups": ["list", "align"] },
        { "name": "insert", "groups": ['Image', 'Flash', 'Table', 'HorizontalRule', 'Smiley', 'SpecialChar', 'PageBreak'] },
        { "name": "document", "groups": ["mode"] },
        { "name": "styles", "groups": ["styles"] },
        { "name": "colors" },
        { "name": "tools", "groups": ["Maximize"] }
      ]
    };
    this.getProjectsNames();
  }

  // get Tru projects list
  getProjectsNames = () => {
    const getproj = this.discussionService.getProjects(this.loggedInuserDetails).subscribe((response) => {
      if (response && response['data']) { this.ProjectsNames = response['data']; }
    });
    this._unsubscribeAll.push(getproj);
  }
  // *** get data from Dynamic component *** //
  receiveimage = ($event) => {
    this.inputFiles = $event;
  }
  // add new disccusion
  insertDiscussion = (newDiscussionModel) => {
    this.disableButton = true;
    if (this.loggedInuserDetails !== null) {
      newDiscussionModel['Input'] = 'Insert';
      const insert = this.discussionService.addNewDiscussion(this.loggedInuserDetails, newDiscussionModel, this.inputFiles)
        .subscribe((response) => {
          if (response && response['successful'] === true) {
            this.messageRes['msg'] = 'Your Discussion is Added';
            this.messageRes['css'] = 'text-success';
            this.newDiscussionModel = <INewDiscussionModel>{};
          } else {
            this.messageRes['msg'] = 'Your Discussion insertion Failed';
            this.messageRes['css'] = 'text-danger';
          }
          this.inputFiles = [];
          this.UploadDone = true;
           this.disableButton = false;
          setTimeout(() => {
            this.messageRes = [];
          }, 3000);
        });
      this._unsubscribeAll.push(insert);
    } else {
      this.messageRes['msg'] = 'Your have to login first for Posting New Discussion';
      this.messageRes['css'] = 'text-danger';
    }
  }

  // unique id corresponding to the item
  trackByFn(item) {
    return item.id;
  }

  ngOnDestroy() {
    this._unsubscribeAll.map((item) => item.unsubscribe());
  }
}
