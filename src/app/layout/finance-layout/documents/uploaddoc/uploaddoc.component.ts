import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { FileAttachment } from 'src/app/shared/components/file-upload/file-attachment.model';
import { IloggedInuserDetails } from 'src/app/shared/models/Authentication/loggedInuserDetails.model';
import { ReportIssueService } from 'src/app/shared/services/customer/report-issue.service';
import { FinanceService } from 'src/app/shared/services/finance/finance.service';

interface IUploadDocModel {
  PropertyName: string,
  PropertyId: string,
  Remark: string,
  DocName: string,
  btnFlag: boolean
}

@Component({
  selector: 'app-uploaddoc',
  templateUrl: './uploaddoc.component.html',
  styleUrls: ['./uploaddoc.component.scss']
})
export class UploaddocComponent implements OnInit, OnDestroy {
  filesModel: FileAttachment[] = [];
  selectedProjects: string[] = [];
  documentsList: string[] = [];
  uploadDocModel: IUploadDocModel = <IUploadDocModel>{};
  loggedInuserDetails: IloggedInuserDetails = <IloggedInuserDetails>{};

  private _unsubscribeAll: Array<Subscription> = [];

  @Output() goBack = new EventEmitter<boolean>();

  constructor(
    private snackBar: MatSnackBar,
    private reportServices: ReportIssueService,
    private financeService: FinanceService) { }
    
  ngOnInit() {
    this.loggedInuserDetails = JSON.parse(localStorage.getItem('LoggedinUser'));
    this.getAllProjectName();
  }

  goBacktoHome = () => {
    this.goBack.emit(false);
  }

  // Get All Project   
  getAllProjectName = () => {
    const getAllProjectNameSub = this.reportServices.GetProjectNameList(this.loggedInuserDetails)
      .subscribe((response) => {
        if (response && response["data"]) { this.selectedProjects = response["data"]; }
      });
    this._unsubscribeAll.push(getAllProjectNameSub);
  }

  // Get Uploaded Documents  
  getUploadedDocs = () => {
    const getUploadedDocSub = this.financeService.getuploadDocs(this.loggedInuserDetails, { Input: 'Search' })
      .subscribe((response) => {
        if (response && response["data"]) { this.documentsList = response["data"]; }
      });
    this._unsubscribeAll.push(getUploadedDocSub);
  }

  // Upload New Doc
  onUpload = (uploadForm) => {
    this.uploadDocModel.btnFlag = true;
    let modelData = {
      Input: 'Insert',
      UserId: this.loggedInuserDetails.UserId,
      EntityId: this.loggedInuserDetails.EntityId,
      Remark: this.uploadDocModel.Remark,
      PropertyName: this.uploadDocModel.PropertyName,
      DocName: this.uploadDocModel.DocName
    }
    const onSubmitSub = this.financeService.uploadDoc(this.loggedInuserDetails, modelData, this.filesModel)
      .subscribe((response) => {
        if (response && response['successful']) {
          this.snackBar.open('Document Uploaded', 'Close', { duration: 5000, panelClass: ['blue-snackbar'] });
          this.goBacktoHome();
        } else {
          this.snackBar.open('Something wents wrong', 'Close', { duration: 5000, panelClass: ['red-snackbar'] });
        }
        uploadForm.form.reset();
      });
    this._unsubscribeAll.push(onSubmitSub);
  }

  receiveimage = ($event) => {
    this.filesModel = $event;
  }

  trackByFn(item) {
    return item.id;
  }

  ngOnDestroy() {
    for (let item of this._unsubscribeAll) {
      item.unsubscribe();
    }
  }
}
