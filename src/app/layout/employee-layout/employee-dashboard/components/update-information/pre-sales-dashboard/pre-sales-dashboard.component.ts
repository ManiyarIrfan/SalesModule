import { Component, OnInit, ViewChild, Output, EventEmitter, OnDestroy, HostListener, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { PreSalesDashboardService } from 'src/app/shared/services/employee/pre-sales-dashboard.service';
import { SharedService } from 'src/app/shared/services/shared/shared.service';
import { IloggedInuserDetails } from 'src/app/shared/models/Authentication/loggedInuserDetails.model';
import { ExcelService } from 'src/app/shared/services/shared/excel.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatSnackBar } from '@angular/material';
const Tab14 = 'tab14';
const Tab15 = 'tab15';

@Component({
  selector: 'tru-pre-sales-dashboard',
  templateUrl: './pre-sales-dashboard.component.html',
  styleUrls: ['./pre-sales-dashboard.component.scss']
})
export class PreSalesDashboardComponent implements OnInit, OnDestroy, AfterViewInit {
  public loggedInuserDetails: IloggedInuserDetails = <IloggedInuserDetails>{};
  public missedFollowUpNumber: number;
  public countNewEnquiryNumber: number;
  public countScheduleFollowUpNumber: number;
  public countOfSiteVisitCreated: number;
  public countOfSiteVisitScheduled: number;
  public totalCallCount: number;
  public totalTalktime: number;
  public avgCallTime: number;
  public CustomerMissedCall: number;
  public EmployeeMissedCall: number;
  public OfflineCallDuration: number;
  public todaysFollowup: number;
  public todaySiteVisit: number;
  public Modal_Title: string;
  public DetailList: object[] = [];
  public PreSalesDetailList: string[] = [];
  public total_incoming: number;
  public total_outgoing: number;
  public listlength: number;
  public todays_Reminder: number;
  public todays_offline: number;
  public isLoading: boolean = false;
  public leadName: string;
  public SiteVisitConducted: number;
  public SiteVisitScheduledFuture: number;
  public disableOnTotalCallsTitle: boolean = false;
  public selectedDateRange: { startDate: moment.Moment, endDate: moment.Moment };
  public StartDate: any;
  public EndDate: any
  public tabActivate: string;
  public id: number;
  public currentPageId: 1;
  public allEnquiryId: number[] = [];
  public getEnquirySummaryData: string[] = [];
  public tableHeader: string = '';
  public getHeader: string[] = [];
  public getModelHeader: string[] = [];
  public isSpinnerActive: boolean = false;
  public reEngaggedEnquiry: number;
  public statusFlag: string = '';
  public followUpFlag: boolean = false;
  public durationFlag: boolean = false;
  public ShowSummery: boolean = false;
  public NoActionPlaned: number;
  public p: number = 1;
  public PreferredProject: number;
  public referralInfo: string[] = [];
  private _EventSubscription: Array<Subscription> = [];
  public PreferredProjectInfo: object[] = [];
  public ranges: any = {
    'Today': [moment(), moment()],
    'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
    'Last 7 Days': [moment().subtract(6, 'days'), moment()],
    'Last 30 Days': [moment().subtract(29, 'days'), moment()],
    'This Month': [moment().startOf('month'), moment()],
    'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
    'Last 6 Months': [moment().subtract(6, 'month'), moment()]
  };

  @ViewChild('showModal', { static: false }) public showModal: ModalDirective;
  @Output() emitEvent = new EventEmitter<any>();
  @Output() emitEventoppo = new EventEmitter<any>();
  constructor(private preSalesDashboardService: PreSalesDashboardService,
    private excelService: ExcelService,
    private spinner: NgxSpinnerService,
    private snackBar: MatSnackBar,
    private sharedService: SharedService,
    public router: Router) { }

  ngOnInit() {
    if (localStorage.getItem('LoggedinUser')) {
      this.loggedInuserDetails = JSON.parse(localStorage.getItem('LoggedinUser'));
      if (this.loggedInuserDetails) {
        this.getTotal_Count();
      }
    } else {
      this.router.navigate(['/login']);
    }
  }
  ngAfterViewInit(): void {
    this.isSpinnerActive = false;
    let InputModel = {};
    InputModel['FromDate'] = null;
    InputModel['ToDate'] = null;
    InputModel['ProjectId'] = null;
    InputModel['UserType'] = null;
    InputModel['TenantId'] = null;
    InputModel['Input'] = 'AllReport';
    InputModel['EntityId'] = this.loggedInuserDetails.EntityId;
    this.getPreSalesDashboardReport(this.loggedInuserDetails, InputModel);
    this.GetPreferredProjectByArea();
  }
  //..........................Method TO get Count Of 
  getTotal_Count = () => {
    this.isSpinnerActive = true;
    const totalCountSubscription = this.preSalesDashboardService.total_Count(this.loggedInuserDetails).subscribe((response) => {
      if (response && response['data']) {
        this.missedFollowUpNumber = response['data'][0] && response['data'][0][0].MissedFollowUp ? response['data'][0][0].MissedFollowUp : 0;
        this.countNewEnquiryNumber = response['data'][1] && response['data'][1][0].NoOfEnquiry ? response['data'][1][0].NoOfEnquiry : 0;
        this.totalCallCount = response['data'][2] && response['data'][2][0].CallCount ? response['data'][2][0].CallCount : 0;
        this.countScheduleFollowUpNumber = response['data'][3] && response['data'][3][0].ScheduledFollowUp ? response['data'][3][0].ScheduledFollowUp : 0;
        this.countOfSiteVisitCreated = response['data'][4] && response['data'][4][0].SiteVisitCreated ? response['data'][4][0].SiteVisitCreated : 0;
        this.countOfSiteVisitScheduled = response['data'][5] && response['data'][5][0].SiteVisitScheduled ? response['data'][5][0].SiteVisitScheduled : 0;
        this.totalTalktime = response['data'][6] && response['data'][6][0].Talktime ? response['data'][6][0].Talktime : 0;
        this.avgCallTime = response['data'][7] && response['data'][7][0].AverageCallTalktime ? response['data'][7][0].AverageCallTalktime : 0;
        this.CustomerMissedCall = response['data'][8] && response['data'][8][0].CustomerMissedCall ? response['data'][8][0].CustomerMissedCall : 0;
        this.OfflineCallDuration = response['data'][9] && response['data'][9][0].OfflineCallDuration ? response['data'][9][0].OfflineCallDuration : 0;
        this.todaysFollowup = response['data'][10] && response['data'][10][0].ScheduledFollowUp ? response['data'][10][0].ScheduledFollowUp : 0;
        this.todaySiteVisit = response['data'][11] && response['data'][11][0].ScheduleSiteVisit ? response['data'][11][0].ScheduleSiteVisit : 0;
        this.total_incoming = response['data'][12] && response['data'][12][0].TotalIncoming ? response['data'][12][0].TotalIncoming : 0;
        this.total_outgoing = response['data'][13] && response['data'][13][0].Outgoing ? response['data'][13][0].Outgoing : 0;
        this.todays_Reminder = response['data'][14] && response['data'][14][0].Reminder ? response['data'][14][0].Reminder : 0;
        this.todays_offline = response['data'][15] && response['data'][15][0].Offline_Calls ? response['data'][15][0].Offline_Calls : 0;
        this.SiteVisitConducted = response['data'][16] && response['data'][16][0].SiteVisitConducted ? response['data'][16][0].SiteVisitConducted : 0;
        this.EmployeeMissedCall = response['data'][17] && response['data'][17][0].EmployeeMissedCall ? response['data'][17][0].EmployeeMissedCall : 0;
        this.reEngaggedEnquiry = response['data'][18] && response['data'][18][0].ReengagedLeads ? response['data'][18][0].ReengagedLeads : 0;
        this.NoActionPlaned = response['data'][19] && response['data'][19][0].NoActionPlaned ? response['data'][19][0].NoActionPlaned : 0;
        this.SiteVisitScheduledFuture = response['data'][20][0].SiteVisitScheduledFuture ? response['data'][20][0].SiteVisitScheduledFuture : 0;
      }
    });
    this._EventSubscription.push(totalCountSubscription);
  }
  //...............Method to open Modal for showing details............//
  Show_Modal = (status) => {
    this.statusFlag = status;
    this.durationFlag = false;
    this.spinner.show();
    switch (status) {
      case 'New_Enquiry': this.Modal_Title = "New Enquiry Details"; break;
      case 'EmployeeMissed_Calls':
        this.durationFlag = true;
        this.Modal_Title = "Employee Missed Calls Details";
        break;
      case 'CustomerMissed_Calls':
        this.durationFlag = true;
        this.Modal_Title = "Customer Missed Calls Details";
        break;
      case 'Missed_Followup': this.Modal_Title = "Missed Follow-Up Details"; break;
      case 'Today_Followup': this.Modal_Title = "Today's Follow-Up Details"; break;
      case 'Today_Sitevisit': this.Modal_Title = "Today's Site Visit Details"; break;
      case 'Reminder': this.Modal_Title = "Future Follow-Up Details"; break;
      case 'Total_Incoming':
        this.durationFlag = true;
        this.Modal_Title = "Today's Total Incoming Calls Details";
        break;
      case 'Total_Outgoing':
        this.durationFlag = true;
        this.Modal_Title = "Today's Total Outgoing Calls Details";
        break;
      case 'Sitevisit_Created': this.Modal_Title = "Site Visit Created Details"; break;
      case 'Schedule_Sitevisit': this.Modal_Title = "Todays Created Sitevisit"; break;
      case 'Offline_Calls':
        this.durationFlag = true;
        this.Modal_Title = "Offline Calls Details";
        break;
      case 'SiteVisit_Conducted': this.Modal_Title = "Site Visit Conducted"; break;
      case 'Re-engaged_Leads': this.Modal_Title = "Re-Engaged Enquiry"; break;
      case 'Total_Calls':
        if (status === 'Total_Calls') {
          this.durationFlag = true;
          this.Modal_Title = "Todays Total Calls";
          this.disableOnTotalCallsTitle = true;
        } else {
          this.disableOnTotalCallsTitle = false;
        }
        break;
      case 'NoActionPlaned': this.Modal_Title = "No Action Planned"; break;
      case 'SiteVisitScheduledFuture': this.Modal_Title = "Site Visit Scheduled (Future)"; break;
      default: break;
    }
    this.DetailList = [];
    this.isLoading = true;
    this.p = 1;
    this.spinner.show();
    this.showModal.show();
    const showModalSubscription = this.preSalesDashboardService.DetailForModal(this.loggedInuserDetails, status, this.StartDate, this.EndDate).subscribe((response) => {
      if (response && response['data']) {
        this.DetailList = response['data'];
        this.isLoading = false;
        this.spinner.hide();
      }
      this._EventSubscription.push(showModalSubscription);
    });
  }
  // ............ method to close modal..........//
  onClose = () => {
    this.showModal.hide();
    // this.selectedDateRange = { startDate: moment(), endDate: moment() };
  }
  @HostListener('document:keyup', ['$event']) handleKeyUp(event) {
    if (event.keyCode === 27) {
      this.onClose();
    }
  }

  // when 'Total Calls' Tile click show popup and and giving option of start date and End Date 
  onChangeDate = (selectedDateRange, Status) => {
    if (selectedDateRange != undefined && selectedDateRange.startDate != null && selectedDateRange.endDate != null) {
      //************ when date range change *************// 
      this.StartDate = selectedDateRange.startDate;
      this.EndDate = selectedDateRange.endDate;
      if (Status === 'No Action Planned') {
        const onChangeDateSubscribtion = this.preSalesDashboardService.getAllPresalesLead(this.loggedInuserDetails, Status, this.StartDate.format('YYYY-MM-DD'), this.EndDate.format('YYYY-MM-DD')).subscribe((response) => {
          if (response && response['data'][0]) {
            this.DetailList = response['data'][0];
            this.listlength = this.DetailList.length;
            this.isLoading = false;
          }
        });
        this._EventSubscription.push(onChangeDateSubscribtion);
      } else {
        const onChangeDateSubscribtion = this.preSalesDashboardService.DetailForModal(this.loggedInuserDetails, Status, this.StartDate.format('YYYY-MM-DD'), this.EndDate.format('YYYY-MM-DD')).subscribe((response) => {
          if (response && response['data']) {
            this.DetailList = response['data'];
            this.listlength = this.DetailList.length;
            this.isLoading = false;
          }
        });
        this._EventSubscription.push(onChangeDateSubscribtion);
      }
      //************ End *************//
    }
  }

  selectedShowDetails = (details, Data) => {
    //************ Selected id show all information *************//
    //************* Moved to Lead details Tab **************//
    this.allEnquiryId = [];
    Data.forEach(element => {
      element['ReferralId'] = (element['ReferralId'] && element['ReferralId'] !== null) ? element['ReferralId'] : null;
      if (element['ReferralId'] === null) {
        this.allEnquiryId.push(element['EnquiryId']);
      } else {
        (element['IsReferralActive'] === 1) ? this.allEnquiryId.push(element['LeadId'] ? element['LeadId'] : element['ReferralId']) : null;
      }
    });
    if (details.UserType === 'Referral' || details.ReferralId) {
      this.showModal.hide();
      let test = details.LeadId ? details.LeadId : details.ReferralId ? details.ReferralId : details.EnquiryId;
      this.referralInfo['LeadId'] = test
      this.referralInfo['allId'] = this.allEnquiryId;
      this.tabActivate = Tab15;
      this.emitEventoppo.emit(this.referralInfo);
      this.sharedService.shareLeadDetails(this.tabActivate);
    } else {
      this.showModal.hide();
      this.id = details.EnquiryId;
      this.tabActivate = Tab14;
      this.emitEvent.emit({ id: this.id, enqId: this.allEnquiryId });
      this.sharedService.shareLeadDetails(this.tabActivate);
    }
    //************* End **************//
  }
  //**** get PreSales Dashboard Report ****//
  getPreSalesDashboardReport = (loggedInuserDetails, InputModel) => {
    this.spinner.show();
    const SelectPreSalesDashboardReport = this.preSalesDashboardService.SelectPreSalesDashboardReport(loggedInuserDetails, InputModel).subscribe((response) => {
      if (response && response['data'][0] && response['data'][0].length > 0) {
        this.getHeader = response["data"][0] ? Object.keys(response["data"][0][0]) : [];
        this.getEnquirySummaryData = response["data"][0];
        if (this.getHeader && this.getHeader.length > 0) {
          this.deleteItem(this.getHeader, 'PresalesAgentAssigned');
        }
        this.spinner.hide();
      } else {
        this.showFailedBar('No Data Found');
        this.spinner.hide();
      }
    });
    this._EventSubscription.push(SelectPreSalesDashboardReport);

  }
  // when 'Total Calls' Tile click show popup and and giving option of start date and End Date 
  onPerformanceChangeDate = (selectedDateRange, ProjectId) => {
    if (selectedDateRange != undefined && selectedDateRange.startDate != null && selectedDateRange.endDate != null) {
      //************ when date range change *************// 
      this.StartDate = selectedDateRange.startDate;
      this.EndDate = selectedDateRange.endDate;
      let InputModel = {};
      InputModel['FromDate'] = (this.selectedDateRange && this.selectedDateRange.startDate) ? this.selectedDateRange.startDate.format('YYYY-MM-DD') : null;;
      InputModel['ToDate'] = (this.selectedDateRange && this.selectedDateRange.endDate) ? this.selectedDateRange.endDate.format('YYYY-MM-DD') : null;;
      InputModel['Input'] = 'AllReport';
      InputModel['Tenant'] = this.loggedInuserDetails.TenantId;
      InputModel['EntityId'] = this.loggedInuserDetails.EntityId;
      InputModel['ProjectId'] = ProjectId ? ProjectId : null;
      this.getPreSalesDashboardReport(this.loggedInuserDetails, InputModel);
    }
  }
  //**** get Summary Detail Report ****//
  getSummaryDetail(header, tableDataRow, ProjectId) {
    this.currentPageId = 1;
    let StatusList = [];
    StatusList = ('Cold,Hot,Incoming,Lost,Prospect,Unqualified,Warm').split(',');
    let InputModel = {};
    InputModel['FromDate'] = (this.selectedDateRange && this.selectedDateRange.startDate) ? this.selectedDateRange.startDate.format('YYYY-MM-DD') : null;;
    InputModel['ToDate'] = (this.selectedDateRange && this.selectedDateRange.endDate) ? this.selectedDateRange.endDate.format('YYYY-MM-DD') : null;;
    InputModel['ProjectId'] = ProjectId ? ProjectId : null;
    InputModel['UserType'] = null;
    InputModel['Input'] = (StatusList.indexOf(header)) !== -1 ? 'EnquiryByStatus' : header;
    InputModel['EntityId'] = tableDataRow.PresalesAgentAssigned;
    InputModel['Tenant'] = this.loggedInuserDetails.TenantId;
    InputModel['Status'] = header;
    this.PreSalesDetailList = [];
    if (Number(tableDataRow.PresalesAgentAssigned)) {
      this.spinner.show();
      const SelectPreSalesDashboardReport = this.preSalesDashboardService.SelectPreSalesDashboardReport(this.loggedInuserDetails, InputModel).subscribe((response) => {
        if (response && response['exception'] !== 'No Data Found' && response['data'][0]) {
          this.ShowSummery = true;
          this.getModelHeader = response["data"][0] ? Object.keys(response["data"][0][0]) : [];
          if (this.getModelHeader && this.getModelHeader.length > 0) {
            this.deleteItem(this.getModelHeader, 'ReferralId');
            this.deleteItem(this.getModelHeader, 'EnquiryId');
            this.PreSalesDetailList = response['data'][0];
            this.showModal.show()
            this.spinner.hide();
          } else {
            this.showFailedBar('No Data Found');
          }
        } else {
          this.showFailedBar('No Data Found');
          this.spinner.hide();
        }
      });
      this._EventSubscription.push(SelectPreSalesDashboardReport);
    }
  }
  GetPreferredProjectByArea = () => {
    const GetProjectList = this.preSalesDashboardService.GetAllProjectName(this.loggedInuserDetails).subscribe((response) => {
      if (response["data"]) {
        this.PreferredProjectInfo = response["data"].filter(x => x['TenantId'] === this.loggedInuserDetails.TenantId);
      }
      this._EventSubscription.push(GetProjectList);
    });
  }
  showSuccessBar = (message: string) => {
    this.snackBar.open(message, null, { duration: 5000, panelClass: ['blue-snackbar'] });
  }
  //------- failed snakbar method -------//
  showFailedBar = (message: string) => {
    this.snackBar.open(message, null, { duration: 7000, panelClass: ['red-snackbar'] });
  }
  deleteItem = (arrayList, key) => {
    const index = arrayList.indexOf(key, 0);
    if (index > -1) {
      arrayList.splice(index, 1);
    }
  }
  //**** get Summary Detail Report ****//
  exportEvent = (data) => {
    data ? this.excelService.exportAsExcelFile(data, 'ExcelSheet') : null;
  }
  trackByFn(item) {
    return item.id; // unique id corresponding to the item
  }

  ngOnDestroy() {
    for (let item of this._EventSubscription) {
      item.unsubscribe();
    }
  }
}