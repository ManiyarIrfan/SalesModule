import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap';
import { ViewprofileCpService } from 'src/app/shared/services/channelPartner/viewprofile-cp.service';
import { routerTransition } from 'src/app/router.animations';
import { FileAttachment } from 'src/app/shared/components/file-upload/file-attachment.model';
import { MatSnackBar } from '@angular/material';
import { Subscription } from 'rxjs';
import { IchannelPartnerModel } from 'src/app/shared/models/channelpartner/view-profile.model';
import { IloggedInuserDetails } from 'src/app/shared/models/Authentication/loggedInuserDetails.model';

@Component({
    selector: 'app-view-profile',
    templateUrl: './view-profile.component.html',
    styleUrls: ['./view-profile.component.scss'],
    animations: [routerTransition()]
})
export class ViewProfileComponent implements OnInit {
    public isDisabled: boolean = false;
    @ViewChild('showBuildingModal', { static: false }) public showBuildingModal: ModalDirective;
    @ViewChild('BrokarageDetailsModal', { static: false }) public BrokarageDetailsModal: ModalDirective;
    @ViewChild('AgreementModal', { static: false }) public AgreementModal: ModalDirective;
    public uploadImages: FileAttachment[] = [];
    public fileUploadList: object[] = [];
    public myIncentive: number[] = [];
    public myBooking: number[] = [];
    public myleads: number[] = [];
    public showDataNotFoundMessage: boolean = true;
    public showSuccessfullMessage: string = "";
    public showNotSuccessfullMessage: string = "";
    public DataNotFoundMessage: string = "";
    public loggedInuserDetails: IloggedInuserDetails = <IloggedInuserDetails>{};
    public channelPartnerModel: IchannelPartnerModel = <IchannelPartnerModel>{};
    public isEdit: boolean = false;
    public isSpinnerActive: boolean = true;
    public emailPattren: any = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    public leadsCounts: number[];
    public bookingCounts: number[];
    public IncentiveCounts: number[];
    public OccupationInfo: any = [
        { key: "Service", value: "Service" },
        { key: "Business", value: "Business" },
        { key: "Retirement", value: "Retirement" },
        { key: "Consultant", value: "Consultant" },
        { key: "House-wife", value: "House-wife" }];
    public getDocumentName: any = [
        { key: "Aadhar", value: "Aadhar" },
        { key: "Pancard", value: "Pancard" },
        { key: "Rera", value: "Rera" },
        { key: "Other", value: "Other" }]
    public PancardTypeList: any = [
        { key: "Individual", value: "Individual" },
        { key: "Hindu Un-divided Family", value: "Hindu Un-divided Family" },
        { key: "Association Of Persons", value: "Asspciation Of Persons" },
        { key: "Body Of Individuals", value: "Body Of Individuals" },
        { key: "Company", value: "Company" },
        { key: "Government", value: "Government" },
        { key: "Artificial Juridicial Person", value: "Artificial Juridicial Person" },
        { key: "Loan Authority", value: "Loan Authority" },
        { key: "Firm", value: "Firm" },
        { key: "Trust", value: "Trust" }];
    public uploadedAttachment: string[] = [];
    public deleteAttachmentList: string[] = [];
    public imageurlList: any[] = [];
    public isDisable: boolean;
    public isPanAvailable: any;
    public showPan: any;

    private _EventSubscription: Array<Subscription> = [];

    constructor(public router: Router,
        private viewprofilecpservice: ViewprofileCpService, private snackBar: MatSnackBar) { }

    ngOnInit() {
        if (localStorage.getItem('LoggedinUser')) {
            this.loggedInuserDetails = JSON.parse(localStorage.getItem('LoggedinUser'));
            if (this.loggedInuserDetails) {
                this.getCpDetails();
            }
        } else {
            this.router.navigate(['/login']);
        }
    }
    // get Cp Details 
    getCpDetails = () => {
       const GetCPDetails= this.viewprofilecpservice.GetChannelPartnerDetails(this.loggedInuserDetails).subscribe((response) => {
            if (response && response["data"]) {
                if (response['exception']) {
                    this.showDataNotFoundMessage = true;
                    this.DataNotFoundMessage = response['exception'];
                } else {
                    this.showDataNotFoundMessage = false;
                }
                this.channelPartnerModel = response["data"][0][0];
                this.isDisabled = this.channelPartnerModel.AccountId && this.channelPartnerModel.AccountId !== null ? true : false;
                this.isDisable = (this.channelPartnerModel.PANVerificationStatus === 'Pending' || this.channelPartnerModel.PANVerificationStatus === 'Rejected') ? false : true;
                this.channelPartnerModel['ReraStartDate'] = this.channelPartnerModel.ReraStartDate ? this.channelPartnerModel.ReraStartDate.split('T')[0] : null;
                this.channelPartnerModel['ReraEndDate'] = this.channelPartnerModel.ReraEndDate ? this.channelPartnerModel.ReraEndDate.split('T')[0] : null;
                this.channelPartnerModel['DateOfBirth'] = this.channelPartnerModel.DateOfBirth ? this.channelPartnerModel.DateOfBirth.split('T')[0] : null;
                this.channelPartnerModel.agreement = this.channelPartnerModel.Agreement ? this.channelPartnerModel.Agreement : null;
                this.uploadedAttachment = this.getUploadedFiles(response["data"][1]);
                let getDate = this.channelPartnerModel.DateOfBirth ? this.channelPartnerModel.DateOfBirth.split('T') : null;
                this.channelPartnerModel.DateOfBirth = getDate ? getDate[0] : null;
                if (this.loggedInuserDetails.UserType === 'CRO') {
                    this.channelPartnerModel.BrokerId = this.channelPartnerModel['CROId'];
                } else {
                    this.channelPartnerModel['custType'] = "channel partner";
                }
                this.GetMyLeads();
                this.GetMyBookings();
                this.GetMyIncentive();
            }
            this.isSpinnerActive = false;
            this._EventSubscription.push(GetCPDetails);
        });
    }
    // ********** get uploaded files of cp **********//
    getUploadedFiles = (uploadedFileString) => {
        let a = [];
        if (uploadedFileString) {
            a = uploadedFileString.map(x => {
                return {
                    FileName: (x['ImageUrl'] && x['ImageUrl'] !== '' && x['ImageUrl'] !== null) ? x['ImageUrl'].split('=')[0] : null,
                    FileUrl: (x['ImageUrl'] && x['ImageUrl'] !== '' && x['ImageUrl'] !== null) ? x['ImageUrl'].split('=')[1] : null
                };
            });
            this.imageurlList.push(uploadedFileString);
        }
        return a;
    }
    // ********** Open file in browser new tab **********//
    goToLink = (url: string) => {
        window.open(url);
    }
    // ********* remove attaced file from list and for delete url add to array *********//
    deleteAttachment = (attachment) => {
        const index = this.uploadedAttachment.indexOf(attachment);
        if (index > -1) {
            this.uploadedAttachment.splice(index, 1);
            this.deleteAttachmentList.push(attachment);
            this.snackBar.open('Please click on update details to delete image permanently', 'Close', { duration: 5000 });
        }
    }
    // ********* remove temp attaced file from list and for delete url add to array *********//
    deleteTempAttachment = (attachment) => {
        const index = this.fileUploadList.indexOf(attachment);
        (index !== -1) ? this.fileUploadList.splice(index, 1) : null;
    }
    // ********* add multiple files to array *********//
    addrow = () => {
        if (this.uploadImages.length > 0) {
            let check = this.uploadedAttachment.some(x => x['FileName'] === this.channelPartnerModel.DocumentName);
            if (!check) {
                let isCheck = (this.fileUploadList && this.fileUploadList.length > 0) ? this.fileUploadList.filter(x => x['UploadFile']).map(e => (e['UploadFile']) ? e['UploadFile'] : null) : [];
                check = isCheck.some(x => x['name'] === this.channelPartnerModel.DocumentName);
            }
            if (!check) {
                this.uploadImages[0]['name'] = this.channelPartnerModel.DocumentName ? this.channelPartnerModel.DocumentName : null;
                this.fileUploadList.push({
                    UploadFile: this.uploadImages[0]
                });
            }
            else {
                this.snackBar.open('This image is already exist please delete previous image', 'Close', { duration: 5000 });
            }
        }
        this.uploadImages = [];
    }
    // when Cp Create account cp Details Reload throw output
    reloadMessage($event) {
        this.getCpDetails();
    }
    GetMyLeads = () => {
        if (this.loggedInuserDetails) {
            const GetLeadDetails =this.viewprofilecpservice.GetMyLeadsDetails(this.loggedInuserDetails).subscribe((response) => {
                if (response["data"]) {
                    this.myleads = response['data'][0].MyLeads;
                    this.leadsCounts = this.myleads;
                }
                this._EventSubscription.push(GetLeadDetails);
            });
        }
    }
    GetMyBookings = () => {
        if (this.loggedInuserDetails) {
            const GetMyBookings=this.viewprofilecpservice.GetMyBookingsDetails(this.loggedInuserDetails).subscribe((response) => {
                if (response["data"]) {
                    this.myBooking = response['data'][0].MyOrders;
                    this.bookingCounts = this.myBooking;
                }
                this._EventSubscription.push(GetMyBookings);
            });
        }
    }
    GetMyIncentive = () => {
        if (this.loggedInuserDetails) {
            const GetIncentive=this.viewprofilecpservice.GetMyIncentiveDetails(this.loggedInuserDetails).subscribe((response) => {
                if (response["data"]) {
                    this.myIncentive = response['data'][0].MyIncentive;
                    this.IncentiveCounts = this.myIncentive;
                }
                this._EventSubscription.push(GetIncentive);
            });
        }
    }
    // GetMyPromotions = () => {
    //     if (this.loggedInuserDetails) {
    //         this.viewprofilecpservice.GetMyPromotionsDetails(this.loggedInuserDetails).subscribe((response) => {
    //             if (response["data"]) {
    //                 // this.selectedProjectNames = response["data"];
    //                 // this.reportIssueModel.ProjectName = this.selectedProjectNames[0].ProjectName;
    //             }
    //         });
    //     }
    // }
    OnEditBtnClick = () => {
        this.showSuccessfullMessage = "";
        this.isEdit = true;
    }
    OnCancelBtnClick = () => {
        this.isEdit = false;
    }
    OnUpdateBtnClick = (Input) => {
        this.isSpinnerActive = true;
        Input === 'Agree' ? this.channelPartnerModel['Agreement'] = 'Agree' : null;
        let finalFile = this.fileUploadList.filter(x => x['UploadFile']).map(e => (e['UploadFile']) ? e['UploadFile'] : null);
        this.channelPartnerModel['deleteImages'] = (this.deleteAttachmentList && this.deleteAttachmentList.length > 0) ? this.deleteAttachmentList.map(x => x['FileName'] + '=' + x['FileUrl']).join(',') : null;
        this.channelPartnerModel['ImageUrlList'] = (this.imageurlList[0] && this.imageurlList[0].length > 0) ? this.imageurlList[0].map(x => x['Imagetype'] + '=' + x['ImageUrl']).join(',') : null;
       const UpdateChannelPartnerDetails= this.viewprofilecpservice.UpdateChannelPartnerDetails(this.channelPartnerModel, this.loggedInuserDetails, finalFile).subscribe((response) => {
            if (response['successful']) {
                if (Input === 'Agree') {
                    this.showSuccessBar('Agreement Updated Successfully');
                    this.AgreementModal.hide();
                } else {
                    this.showSuccessBar("Record Updated Sucessfully.")
                }
                this.isSpinnerActive = false;
            } else {
                if (Input === 'Agree') {
                    this.showFailedBar('Failed to submit');
                } else {
                    this.showFailedBar("Record Updation Failed.")
                }
                this.isSpinnerActive = false;
            }
            this.getCpDetails();
            this.uploadImages = [];
            this.fileUploadList = [];
            this.deleteAttachmentList = [];
        });
        this._EventSubscription.push(UpdateChannelPartnerDetails);
        this.isEdit = false;
    }
    // validate pancard details
    getPanValidation = (panno) => {
        const getPanValidation=this.viewprofilecpservice.getPanValidation(panno).subscribe((response) => {
            if (response && response["data"] && response["data"][0]) {
                this.isPanAvailable = (response["data"][0].IsAvailable === 'Available');
                this.showPan = response["data"][0].IsAvailable;
            }
            this._EventSubscription.push(getPanValidation);
        });
    }
    getToday(): string {
        return new Date().toISOString().split('T')[0];
    }
    ngOnDestroy() {
        for (let item of this._EventSubscription) {
            item.unsubscribe();
        }
    }
    trackByFn(item) {
        return item.id; // unique id corresponding to the item
    }
    showSuccessBar = (message: string) => {
        this.snackBar.open(message, null, { duration: 5000, panelClass: ['blue-snackbar'] });
    }
    //------- failed snakbar method -------//
    showFailedBar = (message: string) => {
        this.snackBar.open(message, null, { duration: 7000, panelClass: ['red-snackbar'] });
    }
    onCloseUpdate = () => {
        //.....close modal method on click...........//
        this.AgreementModal.hide();
    }
}
