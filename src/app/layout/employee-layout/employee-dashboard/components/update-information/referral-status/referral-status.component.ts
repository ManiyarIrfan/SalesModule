import { Component, OnInit, EventEmitter, Output, Pipe, ViewChild, OnDestroy, Input, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap';
import { Subscription } from 'rxjs';
import { SharedService } from 'src/app/shared/services/shared/shared.service';
import { ReferralDashboardService } from 'src/app/shared/services/employee/referral-dashboard.service';
import { routerTransition } from 'src/app/router.animations';
import { EncryptDecryptService } from 'src/app/shared/services/shared/encrypt-decrypt.service';
import { IfilterReferalStatus,IleadDetailsModal } from 'src/app/shared/models/employeeModel/referal-status.model';
import {IloggedInuserDetails} from 'src/app/shared/models/Authentication/loggedInuserDetails.model';
import * as moment from 'moment';
const tab15 = `tab15`;
const tab7 = `tab7`;
@Component({
  selector: 'tru-referral-status',
  templateUrl: './referral-status.component.html',
  styleUrls: ['./referral-status.component.scss'],
  animations: [routerTransition()]
})
@Pipe({ name: 'titlecase', pure: false })
export class ReferralStatusComponent implements OnInit, OnDestroy {
  public filterDataModel: IfilterReferalStatus = <IfilterReferalStatus>{};
  public reportname: string[] = [];
  public selectedReportingto: string[] = [];
  public isSpinnerActive: boolean;
  public showReferral: string[] = [];
  public loggedInuserDetails: IloggedInuserDetails=<IloggedInuserDetails>{};
  public termstatus: string;
  public tabActivate: number;
  public statusHistory: string;
  public arrString: string;
  public arrReferralStatus: string[] = [];
  public exception: boolean = false;
  public termLead: string;
  public term: string;
  public Leadid: number;
  public name: string;
  public reportingName: string;
  public source: string;
  public status: string;
  public p1: number;
  public disabled = true;
  public disableForPresales: boolean = false;
  public countOnStatus: number;
  public leadDetailsModal: IleadDetailsModal=<IleadDetailsModal>{};
  public filterAllPresalesLead: string[] = [];
  public CurrentPageId: number = 1;
  public collapsed: boolean = true;
  public selectedDateRange: string;
  public StatusInfo: any = [
    { key: "AllLeads", value: "All Leads" },
    { key: "New", value: "New" },
    { key: "Contact Establish", value: "Contact Establish" },
    { key: "Site Visit Scheduled", value: "Site Visit Scheduled" },
    { key: "Site Visit Done", value: "Site Visit Done" },
    { key: "Negotiation", value: "Negotiation" },
    { key: "Booked", value: "Booked" },
    { key: "Cold", value: "Cold / Not Responding" },
    { key: "Unqualified", value: "Unqualified" },
    { key: "Lost", value: "Lost" },
    { key: "EOI Submitted", value: "EOI Submitted" },
    { key: "Assigned to Presales", value: "Assigned to Presales" }];
  public ListOffilter = [
    { item: 'ReferralId' },
    { item: 'Name' },
    { item: 'ReferralStatus' },
    { item: 'Source' }
  ];
  public ranges: any = {
    'Today': [moment(), moment()],
    'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
    'Last 7 Days': [moment().subtract(6, 'days'), moment()],
    'Last 30 Days': [moment().subtract(29, 'days'), moment()],
    'This Month': [moment().startOf('month'), moment()],
    'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
    'Last 6 Months': [moment().subtract(6, 'month'), moment()]
  };
  public getReportReferralDetailsSubscription: Subscription;
  public getSelectedReportingSubscription: Subscription;

  @ViewChild('ConfirmationModel', { static: false }) public ConfirmationModel: ModalDirective;
  @ViewChild('showLeadDetailsModal', { static: false }) public showLeadDetailsModal: ModalDirective;
  @Input() allReferralId: any;
  @Output() emitEventoppo = new EventEmitter<any>();
  @Output() emitEventorder = new EventEmitter<any>();
  public StartDate: any;
  public EndDate: any;

  constructor(
    public router: Router,
    private referralDashboardService: ReferralDashboardService,
    private sharedService: SharedService,
    private encryptDecryptService: EncryptDecryptService) { }

  ngOnInit() {
    if (localStorage.getItem('LoggedinUser')) {
      this.loggedInuserDetails = JSON.parse(localStorage.getItem('LoggedinUser'));
      if (this.loggedInuserDetails.Role === 5) {
        this.disableForPresales = true;
      } else {
        if (sessionStorage.referralstatuscomponent) {
          const Data = JSON.parse(sessionStorage.getItem('referralstatuscomponent'));
          let decryptedData = this.encryptDecryptService.decryptData(Data);
          decryptedData['reportname'] = decryptedData[0]['reportname'] ? decryptedData[0]['reportname'] : null;
          decryptedData['status'] = decryptedData[0]['status'] ? decryptedData[0]['status'] : null;
          this.showReferral = decryptedData[0]['showReferral'] ? decryptedData[0]['showReferral'] : [];
          this.CurrentPageId = decryptedData[0]['pageid'] ? decryptedData[0]['pageid'] : 1;
          this.countOnStatus = decryptedData[0]['countOnStatus'] ? decryptedData[0]['countOnStatus'] : 1;
          this.termstatus = decryptedData[0]['termstatus'] ? decryptedData[0]['termstatus'] : '';
          this.filterAllPresalesLead = decryptedData[0]['filterAllPresalesLead'] ? decryptedData[0]['filterAllPresalesLead'] : '';
          this.allReferralId = decryptedData[0]['allReferralId'] ? decryptedData[0]['allReferralId'] : [];
        } else {
          this.onChangeReporting(this.loggedInuserDetails.EntityId, 'MyTodaysWork');
        }
      }
      this.GetSelectedReportingTo();
    } else {
      this.router.navigate(['/login']);
    }
  }
  onChangeDate = (selectedDateRange) => {
    if (selectedDateRange !== undefined && selectedDateRange.startDate !== null && selectedDateRange.endDate !== null) {
      //********* when date range change *********//
      this.StartDate = selectedDateRange.startDate._d.toLocaleDateString();
      this.EndDate = selectedDateRange.endDate._d.toLocaleDateString();
    } else {
      this.StartDate = null;
      this.EndDate = null;
    }
    this.disabled = false;
  }
  receiveOpportunity = ($event) => {
    //-------Tab switch to Tab no:-15 or TAb 7-------//
    switch ($event) {
      case 'opportunity':
        this.emitEventoppo.emit({ LeadId: this.leadDetailsModal['ReferralId'], allId: this.allReferralId });
        this.sharedService.shareLeadDetails(tab15);
        break;
      case 'order':
        this.emitEventorder.emit(this.leadDetailsModal);
        this.sharedService.shareLeadDetails(tab7);
        break;
    }
    //-------End-------//
  }
  bindReferralStatus = (showReferral) => {
    showReferral.forEach(element => {
      let arr = element.ReferralStatus.split('#**#');
      element.ReferralStatus = arr[arr.length - 1];
      // element.Status = arr[arr.length - 1];                  // if store status in Another Variable
    });
  }
  pageChangeEvent(pageid) {
    this.CurrentPageId = pageid;
    let Data = [];
    Data.push({
      reportname: this.reportname,
      status: this.status,
      pageid: this.CurrentPageId,
      showReferral: this.showReferral,
      countOnStatus: this.countOnStatus,
      termstatus: this.termstatus
    });
    let encryptedData = this.encryptDecryptService.encryptData(Data);
    sessionStorage.setItem('referralstatuscomponent', JSON.stringify(encryptedData));
  }
  onChangeReporting = (reportname, status) => {
    //-------Reporting To Employee's Lead Details-------//
    //this.CurrentPageId = 1;
    this.StartDate = (status === 'Hot' || status === 'NoActionPlanned' || status === 'MyTodaysWork') ? null : this.StartDate;
    this.EndDate = (status === 'Hot' || status === 'NoActionPlanned' || status === 'MyTodaysWork') ? null : this.EndDate;
    this.collapsed = status === 'All' ? false : true;
    this.isSpinnerActive = true;
    this.getReportReferralDetailsSubscription = this.referralDashboardService.getReportReferralDetails(this.loggedInuserDetails, reportname, status, this.StartDate, this.EndDate).subscribe((response) => {
      if (response && response["data"] && response["data"] && response["data"].length > 0) {
        this.exception = false;
        this.showReferral = response["data"];
        this.filterAllPresalesLead = this.showReferral
        this.allReferralId = [];
        this.showReferral.forEach(element => {
          this.allReferralId.push(element['ReferralId']);
        });
        this.countOnStatus = response["data"].length;
        this.bindReferralStatus(this.showReferral);
        this.allReferralId = [];
        this.showReferral.forEach(element => {
          this.allReferralId.push(element['ReferralId']);
        });
        this.CurrentPageId = this.showReferral.length <= 10 ? 1 : this.CurrentPageId;
        let Data = [];
        Data.push({
          reportname: this.reportname,
          status: this.status,
          pageid: this.CurrentPageId,
          showReferral: this.showReferral,
          countOnStatus: this.countOnStatus,
          termstatus: this.termstatus,
          filterAllPresalesLead: this.filterAllPresalesLead,
          allReferralId: this.allReferralId
        });
        let encryptedData = this.encryptDecryptService.encryptData(Data);
        sessionStorage.setItem('referralstatuscomponent', JSON.stringify(encryptedData));
      } else {
        this.exception = true;
        this.showReferral = [];
        this.countOnStatus = 0;
      }
      this.isSpinnerActive = false;
    });
    //-------End-------//
  }
  GetSelectedReportingTo = () => {
    this.getSelectedReportingSubscription = this.referralDashboardService.GetSelectedReporting(this.loggedInuserDetails).subscribe((response) => {
      if (response && response["data"]) {
        this.selectedReportingto = response["data"] ? response["data"] : [];
      }
    });
  }

  emitUpdateReferral = (referralInfo) => {
    //-------emit Lead/Referral Information for Update-------//   
    this.leadDetailsModal = referralInfo;
    this.showLeadDetailsModal.show();
  }

  filterLeadData = () => {
    let counter = 0;
    this.ListOffilter.map(element => {
      if (element && this.filterDataModel[element.item]) {
        let Data = counter > 0 ? this.showReferral : this.filterAllPresalesLead;
        this.showReferral = Data.filter(x => x[element.item] && x[element.item].toString().toLowerCase().indexOf(String(this.filterDataModel[element.item]).toLowerCase()) !== -1);
        counter++;
      }
    });
    this.showReferral = counter === 0 ? this.filterAllPresalesLead : this.showReferral;
  }


  trackByFn(item) {
    return item.id; // unique id corresponding to the item
  }
  @HostListener('document:keyup', ['$event']) handleKeyUp(event) {
    if (event.keyCode === 27) {
      this.showLeadDetailsModal.hide()
    }
  }

  ngOnDestroy = () => {
    this.getReportReferralDetailsSubscription ? this.getReportReferralDetailsSubscription.unsubscribe() : null;
    this.getSelectedReportingSubscription ? this.getSelectedReportingSubscription.unsubscribe() : null;
  }
}
