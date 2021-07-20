import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap';
import { ReportIssueService } from 'src/app/shared/services/customer/report-issue.service';
import { FileAttachment } from 'src/app/shared/components/file-upload/file-attachment.model';
import { routerTransition } from 'src/app/router.animations';
import { Subscription } from 'rxjs';
import { IreportIssueModel, IsessionModel, IselectedProjectNames } from 'src/app/shared/models/Customer/report-issue.model';
import { IloggedInuserDetails } from 'src/app/shared/models/Authentication/loggedInuserDetails.model';
import { MatSnackBar } from '@angular/material';

@Component({
    selector: 'report-issues-schedule',
    templateUrl: './report-issues.component.html',
    styleUrls: ['./report-issues.component.scss'],
    animations: [routerTransition()]
})
export class reportissuesComponent implements OnInit, OnDestroy {
    public filesModel: FileAttachment[] = [];
    public showDataNotFoundMessage: boolean = true;
    public showSuccessfullMessage: string = "";
    public showUnSuccessfullMessage: string = "";
    public reportIssueModel: IreportIssueModel = <IreportIssueModel>{};
    public sessionModel: IsessionModel = <IsessionModel>{};
    public loggedInuserDetails: IloggedInuserDetails = <IloggedInuserDetails>{};
    public selectedProjectNames: object[]=[];
    public isSpinnerActive: boolean = true;
    public isEdit: boolean = true;
    public isOn: boolean = true;
    public DataNotFoundMessage: string = "";
    public images: string[] = [];
    public imageNotAvailable: string = "";
    public showServiceRequest: IreportIssueModel[] = [];
    public userType: string = '';
    public isShow: boolean = true;
    public imagesArray: string[] = [];
    public imageUrlPath: string;
    public p1: number;
    public isLoading: boolean = false;
    public isLoadingServiceRequestDetails: boolean = false;
    public showServiceRequestDetails: boolean = false;
    public disableButton: boolean = false;
    public issueTypeInfo: any = [
        { key: "Pre-Sales Service Issue", value: "Pre-Sales: Customer Service Issue" },
        { key: "Pre-Sales Long Waiting", value: "Pre-Sales: Long Waiting" },
        { key: "Pre-Sales Rates To High", value: "Pre-Sales: Rates To High" },
        { key: "Pre-Sales Sales-Agent Behaviour", value: "Pre-Sales: Sales-Agent Related" },
        { key: "Pre-Sales CRM-Agent Behaviour", value: "Pre-Sales: CRM-Agent Related" },
        { key: "Post-Sales Water leakage", value: "Post-Sales: Water leakage" },
        { key: "Post-Sales Electrical Damage", value: "Post-Sales: Electrical Damage" },
        { key: "Post-Sales Construction Related Issue", value: "Post-Sales: Construction Related Issue" },
        { key: "Post-Sales Water Supply", value: "Post-Sales: Water Supply" },
        { key: "Post-Sales GAS Supply", value: "Post-Sales: GAS Supply" },
        { key: "Post-Sales Plumbing Issue", value: "Post-Sales: Plumbing Issue" },
        { key: "IT Support", value: "IT Support" },
        { key: "Other", value: "Other" }
    ];

    @ViewChild('showServiceRequestImageModal', { static: false }) public showServiceRequestImageModal: ModalDirective;
    // breadCrumps: object[] = [];

    public reportSubscription: Array<Subscription> = []

    constructor(private reportServices: ReportIssueService, public router: Router,private snackBar: MatSnackBar) { }
    ngOnInit() {
        // this.breadCrumps = [{ label: 'Service Request', url: '/customer/report-issues' }];
        if (localStorage.getItem('LoggedinUser')) {
            this.loggedInuserDetails = JSON.parse(localStorage.getItem('LoggedinUser'));
            if (this.loggedInuserDetails) {
                this.sessionModel.EntityId = this.loggedInuserDetails['EntityId'];
                this.userType = this.loggedInuserDetails.UserType;
                this.GetAllProjectName(this.loggedInuserDetails);
                this.GetAllServiceRequestById(this.loggedInuserDetails);
                this.isSpinnerActive = false;
            }
        } else {
            this.router.navigate(['/login']);
        }
        this.reportIssueModel.IssueType = "";
    }
    GetAllProjectName = (loggedInuserDetails) => {
        //-------Get All Project Names-------//
        const getdataSub = this.reportServices.GetProjectNameList(this.loggedInuserDetails)
            .subscribe((response) => {
                if (response["data"]) {
                    this.selectedProjectNames = response["data"];
                }
            });
        this.reportSubscription.push(getdataSub);
        //-------End-------//
    }

    GetAllServiceRequestById = (loggedInuserDetails) => {
        //-------Get All service request of logged in user-------//
        this.isLoadingServiceRequestDetails = true;
        this.showServiceRequestDetails = true;
        const getservicereq = this.reportServices.GetServiceRequestByEntityId(this.loggedInuserDetails).subscribe((response) => {
            if (response && response["data"][0]) {
                if (response['exception'] === "No Data Found") {
                    this.showDataNotFoundMessage = true;
                    this.DataNotFoundMessage = response['exception'];
                }
                else {
                    this.showDataNotFoundMessage = false;
                    this.DataNotFoundMessage = "";
                }
                this.showServiceRequest = response["data"][0];
                this.isLoadingServiceRequestDetails = false;
                this.showServiceRequestDetails = false;
            }
        });
        this.reportSubscription.push(getservicereq);
        //-------End-------//
    }
    OnSubmitBtnClick = (ServiceReportForm, loggedInuserDetails, filesModel) => {
        //-------Submit service request of loggedin user-------//
        this.disableButton = true;
        const submitrequest = this.reportServices.InsertreportIsuueDetails(this.reportIssueModel, this.sessionModel, loggedInuserDetails, filesModel).subscribe((response) => {
            if (response && (response['successful'] || response['value']['successful'])) {
                this.showSuccessBar("Service Request Issue submitted successfully");
                this.GetAllServiceRequestById(loggedInuserDetails);
            } else {
                this.showFailedBar("Could not submit Service Request. Please contact office.");
            }
            this.CreateNewIssue(ServiceReportForm);
            this.disableButton = false;
        });
        this.reportSubscription.push(submitrequest);
        //-------End-------//
    }
    emitIssueID = (issueDetails) => {
        //-------Get All details related to that particular IssueId-------//
        this.reportIssueModel = issueDetails;
        document.body.scrollTop = document.documentElement.scrollTop = 0;
        this.isEdit = false;
        this.imagesArray = this.reportIssueModel['ImageUrl'] ? this.reportIssueModel['ImageUrl'].split(',') : [];
        this.isShow = false;
        //-------End-------//
    }
    getToday(): string {
        //-------can not select future date-------//
        return new Date().toISOString().split('T')[0];
        //-------End-------//
    }
    CreateNewIssue = (ServiceReportForm) => {
        //-------reset all input after insert and update service request-------//
        this.isEdit = true;
        this.reportIssueModel = <IreportIssueModel>{};
        this.filesModel = [];
        this.reportIssueModel.IssueType = "";
        this.reportIssueModel.ProjectName = "";
        ServiceReportForm.form.markAsPristine();
        ServiceReportForm.form.markAsUntouched();
        this.isShow = true;
        //-------End-------//
    }
    viewImage = (imageUrlPath) => {
        //-------this show the images in popup-------//
        if (imageUrlPath != null && imageUrlPath != '') {
            this.imagesArray = imageUrlPath.split(',');
            this.isLoading = true;
            if (this.imagesArray != null && this.imagesArray.length > 0) {
                this.images = this.imagesArray;
                this.isOn = true;
                this.isLoading = false;
            }
        } else {
            this.isOn = false;
            this.imageNotAvailable = "Image is Not Available.";
            this.isLoading = false;
        }
        this.showServiceRequestImageModal.show();
        //-------End-------//
    }
    onClose = () => {
        //-------close the popup-------//
        this.imageNotAvailable = "";
        this.showServiceRequestImageModal.hide();
        //-------End-------//
    }
    ngOnDestroy() {
        for (let item of this.reportSubscription) {
            item.unsubscribe();
        }
    }
    trackByFn(item) {
        return item.id; // unique id corresponding to the item
    }
        //------- success snabar method -------//
  showSuccessBar = (message: string) => {
    this.snackBar.open(message, null, { duration: 5000, panelClass: ['blue-snackbar'] });
  }
  //------- failed snakbar method -------//
  showFailedBar = (message: string) => {
    this.snackBar.open(message, null, { duration: 7000, panelClass: ['red-snackbar'] });
  }
}