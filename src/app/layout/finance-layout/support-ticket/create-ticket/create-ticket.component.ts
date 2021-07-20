import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Subscription } from 'rxjs';
import { FileAttachment } from 'src/app/shared/components/file-upload/file-attachment.model';
import { IloggedInuserDetails } from 'src/app/shared/models/Authentication/loggedInuserDetails.model';
import { IsessionModel } from 'src/app/shared/models/Customer/report-issue.model';
import { IreportIssueModel } from 'src/app/shared/models/employeeModel/edit-service-request.model';
import { ReportIssueService } from 'src/app/shared/services/customer/report-issue.service';

@Component({
  selector: 'app-create-ticket',
  templateUrl: './create-ticket.component.html',
  styleUrls: ['./create-ticket.component.scss']
})
export class CreateTicketComponent implements OnInit, OnDestroy {
  loggedInuserDetails: IloggedInuserDetails = <IloggedInuserDetails>{};
  filesModel: FileAttachment[] = [];
  reportModel: IreportIssueModel = <IreportIssueModel>{};
  sessionModel: IsessionModel = <IsessionModel>{};
  disableButton: boolean;
  selectedProjects: string[] = [];
  isEdit: boolean = true;
  issueTypeInfo: any = [
    { key: "CP/CRO/Multiply - Help/Issue/Suggestion", value: "CP/CRO/Multiply - Help/Issue/Suggestion" },
    { key: "Pre-Sales Service Issue", value: "Pre-Sales: Customer Service Issue" },
    { key: "Pre-Sales Long Waiting", value: "Pre-Sales: Long Waiting" },
    { key: "Pre-Sales Rates To High", value: "Pre-Sales: Rates To High" },
    { key: "Pre-Sales Sales-Agent Related", value: "Pre-Sales: Sales-Agent Related" },
    { key: "Pre-Sales CRM-Agent Related", value: "Pre-Sales: CRM-Agent Related" },
    { key: "Post-Sales Water leakage", value: "Post-Sales: Water leakage" },
    { key: "Post-Sales Electrical Damage", value: "Post-Sales: Electrical Damage" },
    { key: "Post-Sales Construction Related Issue", value: "Post-Sales: Construction Related Issue" },
    { key: "Post-Sales Water Supply", value: "Post-Sales: Water Supply" },
    { key: "Post-Sales GAS Supply", value: "Post-Sales: GAS Supply" },
    { key: "Post-Sales Plumbing Issue", value: "Post-Sales: Plumbing Issue" },
    { key: "Finance Related Issue", value: "Finance Related Issue" },
    { key: "IT Support", value: "IT Support" },
    { key: "Other", value: "Other" }];

  private _unsubscribeAll: Array<Subscription> = [];

  @Output() goBack = new EventEmitter<boolean>();

  constructor(
    private snackBar: MatSnackBar,
    private reportServices: ReportIssueService,) {
    this.loggedInuserDetails = JSON.parse(localStorage.getItem('LoggedinUser'));
    if (this.loggedInuserDetails) {
      this.sessionModel['EntityId'] = this.loggedInuserDetails['EntityId'];
    }
  }

  ngOnInit() {
    this.GetAllProjectName();
  }

  goBacktoHome = () => {
    this.goBack.emit(false);
  }

  // Get All Project Names 
  GetAllProjectName = () => {
    const getAllProjectNameSub = this.reportServices.GetProjectNameList(this.loggedInuserDetails)
      .subscribe((response) => {
        if (response && response["data"]) { this.selectedProjects = response["data"]; }
      });
    this._unsubscribeAll.push(getAllProjectNameSub);
  }

  OnSubmitBtnClick = (ServiceReportForm, loggedInuserDetails, filesModel) => {
    //-------Submit service request of loggedin user-------//
    // this.isSubmitingServiceRequestDetails = true;
    this.disableButton = true;
    const OnSubmitBtnClickSub = this.reportServices
      .InsertreportIsuueDetails(this.reportModel, this.sessionModel, loggedInuserDetails, filesModel)
      .subscribe((response) => {
        if (response && (response['successful'] || response['value']['successful'])) {
          this.snackBar.open('Service Request Issue submitted', 'Close', { duration: 5000, panelClass: ['blue-snackbar'] });
        } else {
          this.snackBar.open('Could not submit Service Request. Please contact office', 'Close', { duration: 5000, panelClass: ['red-snackbar'] });
        }
        this.goBacktoHome();
        this.reportModel = <IreportIssueModel>{};
        this.filesModel = [];
        this.reportModel.IssueType = this.reportModel.ProjectName = '';
        ServiceReportForm.form.markAsPristine();
        ServiceReportForm.form.markAsUntouched();
        this.disableButton = false;
      });
    this._unsubscribeAll.push(OnSubmitBtnClickSub);
  }

  receiveimage = ($event) => {
    this.filesModel = $event;
  }

  // can not select future date 
  getToday(): string {
    return new Date().toISOString().split('T')[0];
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
