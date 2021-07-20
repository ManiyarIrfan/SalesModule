import { Component, OnInit, ViewChild, Pipe, PipeTransform, OnDestroy, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap';
import { CpLeadStatusService } from 'src/app/shared/services/channelPartner/cp-lead-status.service';
import { ExcelService } from 'src/app/shared/services/shared/excel.service';
import { routerTransition } from 'src/app/router.animations';
import { FileAttachment } from 'src/app/shared/components/file-upload/file-attachment.model';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material';
import { IloggedInuserDetails } from 'src/app/shared/models/Authentication/loggedInuserDetails.model';
import { IleadDetails, IreportedBy, IinteractionModel, IreferralDetails, IcpLeadDetails } from 'src/app/shared/models/channelpartner/referral-status.model';

@Component({
    selector: 'app-referral-status',
    templateUrl: './referral-status.component.html',
    styleUrls: ['./referral-status.component.scss'],
    animations: [routerTransition()]
})
@Pipe({ name: 'titlecase', pure: false })

export class ReferralStatusComponent implements OnInit, OnDestroy {
    public importLeadExcel: FileAttachment[] = [];
    public showDataNotFoundMessage: boolean = true;
    public loggedInuserDetails: IloggedInuserDetails = <IloggedInuserDetails>{};
    public searchData: string;
    public isSpinnerActive: boolean = true;
    public NoDataFoundMessage: string = "";
    public leadDetails: IleadDetails = <IleadDetails>{};
    public reportedBy: object[] = [];
    public cpLeadDetails: IcpLeadDetails = <IcpLeadDetails>{};
    public reAssignCp: boolean = false;
    public interactionModel: IinteractionModel[] = [];
    public referralDetails: IreferralDetails[] = [];
    public storereferralDetails: IreferralDetails[] = [];
    public UnqalifiedlostData: IreferralDetails[] = [];
    public ReferralInfo: string;
    public showSuccessfullImportMessage: object;
    public showUnsuccessfullImportMessage: object;
    public collapsed: any = true;
    public showRemark: boolean = false;
    public arrString: string[];
    public statusHistory: string;
    public p: number;
    public q: number;
    public Search: string;
    public list: any = [
        { key: "mylead", value: "My Lead" },
        { key: "unqualifiedlost", value: "Unqualified/lost" }];
    public cpLeadStatusSubscription: Subscription;
    public getAllReportingtoChannelParnerSubscription: Subscription;
    public updateCpStatusSubscription: Subscription;
    public getInteractionSubscription: Subscription;
    public InsertExcelSubscription: Subscription;

    @ViewChild('showChannelPartnerModal', { static: false }) public showChannelPartnerModal: ModalDirective;

    constructor(public router: Router,
        private cpLeadStatusService: CpLeadStatusService,
        private excelService: ExcelService, private snackBar: MatSnackBar) { }

    ngOnInit() {
        if (localStorage.getItem('LoggedinUser')) {
            this.loggedInuserDetails = JSON.parse(localStorage.getItem('LoggedinUser'));
            if (this.loggedInuserDetails) {
                this.getAllReferralDetails();
                this.cpLeadDetails.ReferralStatus = "";
                this.cpLeadDetails.BrokerAssinged = "";
                this.searchData = 'mylead';
            }
        } else {
            this.router.navigate(['/login']);
        }
    }
    exportEvent(searchFilter) {
        if (searchFilter) {
            //-------Export Searched Referral Details From Table-------//
            let data = this.referralDetails.filter(x => (x.Name && x.Name.toLowerCase().indexOf(searchFilter) !== -1) || (x.Email && x.Email.toLowerCase().indexOf(searchFilter) !== -1) || (x.MobileNo && x.MobileNo.toLowerCase().indexOf(searchFilter) !== -1) || (x.ReferralBy && x.ReferralBy.toLowerCase().indexOf(searchFilter) !== -1) || (x.BrokerAssinged && x.BrokerAssinged.toLowerCase().indexOf(searchFilter) !== -1) || (x.PreferredProject && x.PreferredProject.toLowerCase().indexOf(searchFilter) !== -1) || (x.CrmAssinged && x.CrmAssinged.toLowerCase().indexOf(searchFilter) !== -1))
            this.excelService.exportAsExcelFile(data, 'ExcelSheet');
        } else {
            //-------Export All Referral Details From Table-------//
            this.excelService.exportAsExcelFile(this.referralDetails, 'ExcelSheet');
            //-------End-------//
        }
    }
    getAllReferralDetails = () => {
        //-------Get All Referral Details-------//
        this.cpLeadStatusSubscription = this.cpLeadStatusService.GetReferralStatusDetails(this.loggedInuserDetails).subscribe((response) => {
            if (response && response["data"]) {
                if (response['exception']) {
                    this.showDataNotFoundMessage = true;
                    this.NoDataFoundMessage = response['exception'];
                } else {
                    this.showDataNotFoundMessage = false;
                    this.NoDataFoundMessage = '';
                }
                if (this.loggedInuserDetails.UserType === 'ChannelPartner') {
                    this.referralDetails = this.searchData === 'unqualifiedlost' ? response["data"][1] : response["data"][0];
                    this.UnqalifiedlostData = response["data"][1];
                    this.storereferralDetails = response["data"][0];
                    this.bindReferralStatus(this.referralDetails);
                }
                if (this.loggedInuserDetails.UserType === 'CRO') {
                    this.referralDetails = response["data"][0];
                    this.bindReferralStatus(this.referralDetails);
                }
            }
            this.isSpinnerActive = false;
        });
        //-------End-------//
    }
    filterData(Input) {
        this.referralDetails = Input === 'mylead' ? this.storereferralDetails : this.UnqalifiedlostData;
        this.bindReferralStatus(this.referralDetails);
    }
    bindReferralStatus = (referralDetails) => {
        //-------For Split the Referrral Status to show in Grid-------//
        referralDetails.forEach(element => {
            let arr = element.ReferralStatus.split('#**#');
            element.ReferralStatus = arr[arr.length - 1];
        });
        //-------End-------//
    }
    getAllReportingtoChannelParner = () => {
        //-------Get List of Reprting to Channel Partner-------//
        this.getAllReportingtoChannelParnerSubscription = this.cpLeadStatusService.GetChannelPartnerReporting(this.loggedInuserDetails).subscribe((response) => {
            if (response && response["data"]) {
                this.reportedBy = response["data"];
            }
        });
        //-------End-------//
    }
    updateCpDetails = (leadDetails) => {
        //-------After Click on Row data comes here and Open Model Window-------//
        this.getAllReportingtoChannelParner();
        this.showChannelPartnerModal.show();
        this.cpLeadDetails = leadDetails;
        this.ReferralInfo = this.cpLeadDetails.ReferralStatus
        // this.getInteraction(this.cpLeadDetails);
        if (this.loggedInuserDetails.Level === 'L1' || this.loggedInuserDetails.Level === 'L2' && this.searchData !== 'unqualifiedlost') {
            this.reAssignCp = true;
        } else {
            this.reAssignCp = false;
        }
        //-------End-------//
    }
    updateCpStatus = (cpUpdatedLeadDetails, updateCpLeadForm) => {
        //-------Update the Details-------//
        cpUpdatedLeadDetails.ReferralStatus = `${this.ReferralInfo}#**#${cpUpdatedLeadDetails['ReferralStatus']}`;
        this.updateCpStatusSubscription = this.cpLeadStatusService.cpStatusUpdate(this.loggedInuserDetails, cpUpdatedLeadDetails).subscribe((response) => {
            if (response && response['successful']) {
                this.showSuccessBar('Record Updated Sucessfully');
                this.getAllReferralDetails();
                this.statusHistory = cpUpdatedLeadDetails.ReferralStatus;
                this['arrString'] = this.statusHistory.split('#**#');
                this.cpLeadDetails.ReferralStatus = this.arrString[this.arrString.length - 1];
                this.getInteraction(this.cpLeadDetails);
                this.showRemark = false;
            } else {
                this.showFailedBar("Record Updation Failed.");
            }
            updateCpLeadForm.form.markAsPristine();
            updateCpLeadForm.form.markAsUntouched();
        });
        //-------End-------//
    }
    onCloseBtn = () => {
        //-------Close Model Pop-up-------//
        this.showChannelPartnerModal.hide();
        this.cpLeadDetails.ReferralStatus = "";
        this.cpLeadDetails.BrokerAssinged = "";
        this.showRemark = false;
        this.getAllReferralDetails();
        //-------End-------//
    }
    getInteraction = (cpLeadDetails) => {
        //-------Show Interaction Details-------//
        this.getInteractionSubscription = this.cpLeadStatusService.getInteractionDetails(this.loggedInuserDetails, cpLeadDetails).subscribe((response) => {
            if (response && response["data"]) {
                this.interactionModel = response["data"];
            }
        });
        //-------End-------//
    }
    InsertExcel = (importLeadExcel) => {
        //-------import Excel file-------//
        this.InsertExcelSubscription = this.cpLeadStatusService.importExcel(this.loggedInuserDetails, importLeadExcel).subscribe((response) => {
            if (response && response['successful']) {
                this.showUnsuccessfullImportMessage = response;
            } else {
                this.showSuccessfullImportMessage = response;
                this.importLeadExcel = [];
            } setTimeout(() => {
                this.showSuccessfullImportMessage = [];
                this.showUnsuccessfullImportMessage = [];
            }, 5000);
        });
        //-------End-------//
    }
    goDown = () => {
        //-------Scroll Down in Import button Click-------//
        document.body.scrollTop = document.documentElement.scrollTop = (150);
        //-------End-------//
    }
    ngOnDestroy() {
        this.cpLeadStatusSubscription ? this.cpLeadStatusSubscription.unsubscribe() : null;
        this.getAllReportingtoChannelParnerSubscription ? this.getAllReportingtoChannelParnerSubscription.unsubscribe() : null;
        this.updateCpStatusSubscription ? this.updateCpStatusSubscription.unsubscribe() : null;
        this.getInteractionSubscription ? this.getInteractionSubscription.unsubscribe() : null;
        this.InsertExcelSubscription ? this.InsertExcelSubscription.unsubscribe() : null;

    }
    trackByFn(item) {
        return item.id; // unique id corresponding to the item
    }
    @HostListener('document:keyup', ['$event']) handleKeyUp(event) {
        if (event.keyCode === 27) {
            this.onCloseBtn();
        }
    }
    showSuccessBar = (message: string) => {
        this.snackBar.open(message, null, { duration: 5000, panelClass: ['blue-snackbar'] });
    }
    //------- failed snakbar method -------//
    showFailedBar = (message: string) => {
        this.snackBar.open(message, null, { duration: 7000, panelClass: ['red-snackbar'] });
    }
}
export class TitleCasePipe implements PipeTransform {
    //-------TO Show initial letter in Uppercase-------//
    transform(input: string): string {
        return input.length === 0 ? '' :
            input.replace(/\w\S*/g, (txt => txt[0].toUpperCase() + txt.substr(1).toLowerCase()));
    }
    //-------End-------//
}