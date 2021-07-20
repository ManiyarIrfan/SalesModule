import { Component, OnInit, ViewChild, HostListener, OnDestroy, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject, Subscription, SubscriptionLike } from 'rxjs';
import { ModalDirective } from 'ngx-bootstrap';
import { ServiceRequestService } from 'src/app/shared/services/employee/service-request.service';
import { SharedService } from 'src/app/shared/services/shared/shared.service';
import { FileAttachment } from 'src/app/shared/components/file-upload/file-attachment.model';
import { IreportIssueModel, IfilterDataModel, IsessionModel } from 'src/app/shared/models/employeeModel/edit-service-request.model';
import { IloggedInuserDetails } from 'src/app/shared/models/Authentication/loggedInuserDetails.model';
import { MatSnackBar } from '@angular/material';

@Component({
    selector: 'tru-edit-service-request',
    templateUrl: './edit-service-request.component.html',
    styleUrls: ['./edit-service-request.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class EditServiceRequestComponent implements OnInit, OnDestroy {
    public uploadServiceRequestImages: FileAttachment[] = [];
    public filterDataModel: IfilterDataModel = <IfilterDataModel>{};
    public storeData: string[] = [];
    public isSpinnerActive: boolean = true;
    public sessionModel: IsessionModel = <IsessionModel>{};
    public imageUrlPath: string;
    public reportIssueModel: IreportIssueModel = <IreportIssueModel>{};
    public imageDeletedParameter: string[] = [];
    public loggedInuserDetails: IloggedInuserDetails = <IloggedInuserDetails>{};
    public selectedProjectNames: string[] = [];
    public ServiceReportForm: string[] = [];
    public isEditFields: boolean = true;
    public isShowDeleteImageButton: boolean = true;
    public flag: boolean = true;
    public isShowDeleteButtonOnGrid: boolean = false;
    public customers: Observable<any[]>;
    public searchTerm = new Subject<string>();
    public showServiceRequest: string[] = [];
    public searchText: string = '';
    public search: string;
    public entityId: string = '';
    public userType: string = '';
    public isShowFields: boolean = true;
    public empUserType: string;
    public isLoading: boolean;
    public imageNotAvailable: string;
    public images: string[] = [];
    public selectedUser: string[] = [];
    public updateIssueModel: IreportIssueModel = <IreportIssueModel>{};
    public imagesArray: string[] = [];
    public deleteUrlListArray: string[] = [];
    public deleteUrlList: string;
    public confirmDeleteUrl: string;
    public p1: number;
    public showInvalidCustomerSearchError: string = '';
    public issueTypeInfo: any = [
        { key: "IT Support", value: "IT Support" },
        { key: "Process", value: "Process" },
        { key: "Training", value: "Training" },
        { key: "Duplicate", value: "Duplicate" },
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
        { key: "Other", value: "Other" },
    ];
    public showIssueTypeInfo: any = [
        { key: "IT Support", value: "IT Support" },
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
        { key: "Other", value: "Other" }
    ];
    public issueStatusInfo: any = [
        { key: "New", value: "New" },
        { key: "Duplicate", value: "Duplicate" },
        { key: "Assigned ", value: "Assigned" },
        { key: "Resolved ", value: "Resolved" },
    ];
    public getEmployeeList: any = [
        { key: 'IT Support', value: 'IT Support' },
        { key: 'Ashwini', value: 'Ashwini' },
        { key: 'Geetanjali', value: 'Geetanjali' },
        { key: 'Mayur', value: 'Mayur' },
    ];
    public ListOffilter = [
        { item: 'IssueId' },
        { item: 'ModuleName' },
        { item: 'IssueSubject' },
        { item: 'IssueStatus' },
        { item: 'CreatedBy' }
    ]
    public GetAllProjectNameSubscription: Subscription;
    public OnUpdateBtnClickSubscription: Subscription;
    @ViewChild('RaiseRequestModel', { static: false }) public RaiseRequestModel: ModalDirective;
    @ViewChild('showServiceRequestImageModal', { static: false }) public showServiceRequestImageModal: ModalDirective;
    @ViewChild('confirmDeleteModel', { static: false }) public confirmDeleteModel: ModalDirective;
    public selectedIndex: number = 0;
    public showCount: any = [];
    data: any;

    constructor(
        private reportServices: ServiceRequestService,
        private sharedService: SharedService,
        public router: Router, private snackBar: MatSnackBar) { }

    ngOnInit() {
        //-------Searching Of Customer Referral or Channel-Partner Details-------//
        // this.customers = this.searchTerm
        // .debounceTime(300)
        // .distinctUntilChanged()
        // .switchMap(term => term
        //     ? this.sharedService.searchEnqLead(this.loggedInuserDetails, term)
        //     : Observable.of<any[]>([]))
        // .catch(error => {
        //     return Observable.of<any[]>([]);
        // });


        //-------End------//
        this.loggedInuserDetails = JSON.parse(localStorage.getItem('LoggedinUser'));
        if (this.loggedInuserDetails) {
            this.sessionModel['EntityId'] = this.loggedInuserDetails.EntityId;
            this.empUserType = this.loggedInuserDetails.UserType;
        }
        this.GetAllProjectName(this.loggedInuserDetails);
        this.GetAllServiceRequest();
        this.reportIssueModel.IssueStatus = "";
        this.reportIssueModel.IssueType = "IT Support";
    }
    searchCustomer(term: string): void {
        //-------search Customer by Id/first Name/Last Name/Mobile Number/Email-------//
        this.flag = true;
        this.showInvalidCustomerSearchError = "Please Select Name From Searched List.";
        //this.searchTerm.next(term);
        this.sharedService.search(this.loggedInuserDetails, term).subscribe((response) => {
            this.customers = response['data'];
        })
        //-------End-------//
    }
    //*****  on Enter Click *****//
    enterClick = (event, searchText) => {
        if (event.keyCode == 13) {
            this.searchCustomer(searchText);
        }
    }
    // Clear the General Search List on "On Click"
    @HostListener('document:click', ['$event'])
    documentClick(event: MouseEvent) {
        this.flag = false;
        this.showInvalidCustomerSearchError = "";
    }
    GetAllProjectName = (loggedInuserDetails) => {
        //-------Get All ProjectName-------//
        this.GetAllProjectNameSubscription = this.reportServices.GetProjectNameList(this.loggedInuserDetails).subscribe((response) => {
            if (response && response["data"]) {
                this.selectedProjectNames = response["data"];
            }
        });
    }
    filterData(Input) {
        switch (Input) {
            case 'New': {
                this.showServiceRequest = this.storeData.filter(x => x['IssueStatus'] === 'New');
            }
                break;
            case 'Assigned': {
                this.showServiceRequest = this.storeData.filter(x => x['IssueStatus'] === 'Assigned');
            }
                break;
            case 'Resolved': {
                this.showServiceRequest = this.storeData.filter(x => x['IssueStatus'] === 'Resolved');
            }
                break;
            case 'Duplicate': {
                this.showServiceRequest = this.storeData.filter(x => x['IssueStatus'] === 'Duplicate');
            }
                break;
            case 'All': {
                this.showServiceRequest = this.storeData;
            }
        }
    }
    GetAllServiceRequest = () => {
        //-------Service Request of all Customer/channelpartner/Refferal-------//
        this.reportServices.GetAllServiceRequest(this.loggedInuserDetails).subscribe((response) => {
            if (response && response['data']) {
                this.showServiceRequest = response["data"];
                this.storeData = response["data"];
                this.isSpinnerActive = false;
                this.showCount['New'] = this.showServiceRequest.filter(x => x['IssueStatus'] === 'New').length;
                this.showCount['Resolved'] = this.showServiceRequest.filter(x => x['IssueStatus'] === 'Resolved').length;
                this.showCount['Assigned'] = this.showServiceRequest.filter(x => x['IssueStatus'] === 'Assigned').length;
                this.showCount['Duplicate'] = this.showServiceRequest.filter(x => x['IssueStatus'] === 'Duplicate').length;
                this.showCount['All'] = this.showServiceRequest.length;
            }
        });
        //-------End-------//
    }
    //************* filter table popup data **************//
    filterLeadData = () => {
        let counter = 0;
        this.ListOffilter.map(element => {
            if (element && this.filterDataModel[element.item]) {
                let Data = counter > 0 ? this.showServiceRequest : this.storeData;
                this.showServiceRequest = Data.filter(x => x[element.item] && x[element.item].toString().toLowerCase().indexOf(String(this.filterDataModel[element.item]).toLowerCase()) !== -1);
                counter++;
            }
        });
        this.showServiceRequest = counter === 0 ? this.storeData : this.showServiceRequest;
    }
    onselectCustomer(ClientObj) {
        //-------on Selected search customer-------// 
        if (ClientObj.ClientId != 0) {
            this.searchText = `${ClientObj.UserId} - ${ClientObj.Name}- ${ClientObj.MobileNo}-${ClientObj.Email}`;
            this.sharedService.shareSelectedUser(ClientObj);
            this.selectedUser['entityId'] = ClientObj.EntityId;
            this.selectedUser['userType'] = ClientObj.UserType;
            this.flag = false;
            this.showInvalidCustomerSearchError = '';
            //-------End-------//
        } else {
            return false;
        }
    }
    OnSubmitBtnClick = (ServiceReportForm, reportIssueModel, updateIssueModel, uploadServiceRequestImages) => {
        //-------Submit New Report Issue-------//
        this.reportServices.InsertreportIsuueDetails(reportIssueModel, updateIssueModel, uploadServiceRequestImages, this.loggedInuserDetails, this.selectedUser).subscribe((response) => {
            if (response && (response['successful'] || response['value'].successful)) {
                this.data = response['data'][0].IssueId ? response['data'][0].IssueId : null;
                this.RaiseRequestModel.show();
                this.GetAllServiceRequest();
            } else {
                this.showFailedBar("Could Not Submitted Service Request. Please Contact Office.");
            }
            this.CreateNewIssue(ServiceReportForm);
            this.searchText = "";
            this.reportIssueModel.IssueType = "IT Support";
            this.uploadServiceRequestImages = [];
            this.selectedUser = [];
        });
        //-------End-------//
    }
    OnUpdateBtnClick = (ServiceReportForm, reportIssueModel, updateIssueModel) => {
        //-------Update Report Issue-------//
        this.OnUpdateBtnClickSubscription = this.reportServices.updateReportIsuueDetails(this.loggedInuserDetails, this.reportIssueModel, this.updateIssueModel, this.deleteUrlList, this.uploadServiceRequestImages).subscribe((response) => {
            if (response && (response['successful'] || response['value'].successful)) {
                this.showSuccessBar("Service Request Issue Updated Successfully.");
                this.GetAllServiceRequest();
            } else {
                this.showFailedBar("Could Not Updated Service Request.");
            }
            this.CreateNewIssue(ServiceReportForm);
            this.uploadServiceRequestImages = [];
            this.deleteUrlListArray = [];
            this.deleteUrlList = '';
            this.isShowFields = true;
            this.isEditFields = true;
        });
        //-------End-------//
    }
    emitIssueID = (issueDetails, ServiceReportForm) => {
        //-------Emit Issue Id and Update in TextFields-------//
        this.reportIssueModel = issueDetails;
        this.imageUrlPath = this.reportIssueModel.ImageUrl;
        this.sessionModel.EntityId = Number(this.reportIssueModel.EnteredById);
        this.selectedIndex = 1;
        this.uploadServiceRequestImages = [];
        this.updateIssueModel.Details = "";
        ServiceReportForm.form.markAsPristine();
        ServiceReportForm.form.markAsUntouched();
        this.isEditFields = (this.reportIssueModel['IssueStatus'] === 'Resolved' || this.reportIssueModel['IssueStatus'] === 'Closed') ? false : true;
        this.isShowFields = false;
        //-------End-------//
    }
    selectTab(index: any) {
        this.selectedIndex = index.index;
    }

    getToday(): string {
        //-------can not select future date-------//
        return new Date().toISOString().split('T')[0];
        //-------End-------//
    }
    CreateNewIssue = (ServiceReportForm) => {
        //-------Clear All Fields After Click Of Create New Issue Button-------//
        this.reportIssueModel = <IreportIssueModel>{};
        this.updateIssueModel = <IreportIssueModel>{};
        this.reportIssueModel.IssueType = this.issueTypeInfo[0].value;
        this.reportIssueModel.ProjectName = "";
        this.reportIssueModel.IssueType = "";
        this.searchText = "";
        ServiceReportForm.form.markAsPristine();
        ServiceReportForm.form.markAsUntouched();
        this.isShowFields = true;
        this.isEditFields = true;
        //-------End-------//
    }
    viewImage = (imageUrlPath) => {
        //-------this show the image in popup-------//
        if (imageUrlPath != null && imageUrlPath != "") {
            this.imagesArray = imageUrlPath.split(',');
            this.isLoading = true;
            if (this.imagesArray != null) {
                this.images = this.imagesArray;
                this.isShowDeleteImageButton = true;
                this.isLoading = false;
            }
        } else {
            this.isShowDeleteImageButton = false;
            this.imageNotAvailable = "No Image Uploaded. Upload Image To Take Effect.";
            this.isLoading = false;
        }
        this.showServiceRequestImageModal.show();
        this.isShowDeleteButtonOnGrid = true;
        //-------End-------//
    }
    gridViewImage = (imageUrlPath) => {
        //-------this show the image in popup-------//
        if (imageUrlPath != null && imageUrlPath != "") {
            this.imagesArray = imageUrlPath.split(',');
            if (this.imagesArray != null) {
                this.images = this.imagesArray;
                this.isShowDeleteImageButton = true;
            }
        } else {
            this.isShowDeleteImageButton = false;
            this.imageNotAvailable = "No Image Uploaded. Upload Image To Take Effect.";
        }
        this.showServiceRequestImageModal.show();
        this.isShowDeleteButtonOnGrid = false;
        //-------End-------//
    }
    onClose = () => {
        //-------close the popup-------//
        this.RaiseRequestModel.hide();
        this.showServiceRequestImageModal.hide();
        //-------End-------//
    }
    onItemDeleted(imageUrl) {
        //-------select deleted Image Url-------//
        this.confirmDeleteModel.show();
        this.confirmDeleteUrl = imageUrl;
        //-------End-------//
    }
    confirmDeleted() {
        //-------multiple deleted Image URL stored using , seperator-------//
        let index = this.imagesArray.indexOf(this.confirmDeleteUrl);
        if (index != -1) {
            this.imagesArray.splice(index, 1);
        }
        this.deleteUrlListArray.push(this.confirmDeleteUrl);
        this.deleteUrlList = this.deleteUrlListArray.join(',');
        this.confirmDeleteModel.hide();
        this.isShowDeleteImageButton = false;
        this.imageNotAvailable = "Click On Update Issue Button To Take Effect On Image.";
        //-------End-------//
    }
    notConfirm() {
        //-------close notConfirm Popup-------//
        this.confirmDeleteModel.hide();
        //-------End-------//
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
    ngOnDestroy() {
        this.GetAllProjectNameSubscription ? this.GetAllProjectNameSubscription.unsubscribe() : null;
        this.OnUpdateBtnClickSubscription ? this.OnUpdateBtnClickSubscription.unsubscribe() : null;
    }
}