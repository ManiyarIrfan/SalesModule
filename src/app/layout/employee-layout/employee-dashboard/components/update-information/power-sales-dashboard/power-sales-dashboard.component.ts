import { Component, OnInit, ViewChild, EventEmitter, Output, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap';
import { Subscription } from 'rxjs';
import { SharedService } from 'src/app/shared/services/shared/shared.service';
import { PowerSalesDashboardService } from 'src/app/shared/services/employee/power-sales-dashboard.service';
import { IfilterDataModel } from 'src/app/shared/models/employeeModel/FilterDetails.model'
import { IloggedInuserDetails } from 'src/app/shared/models/Authentication/loggedInuserDetails.model';
import { IcpDetail } from 'src/app/shared/models/employeeModel/power-sales-dashboard.model';
import { ExcelService } from 'src/app/shared/services/shared/excel.service';

@Component({
  selector: 'tru-power-sales-dashboard',
  templateUrl: './power-sales-dashboard.component.html',
  styleUrls: ['./power-sales-dashboard.component.scss']
})
export class PowerSalesDashboardComponent implements OnInit, OnDestroy {
  public loggedInuserDetails: IloggedInuserDetails = <IloggedInuserDetails>{};
  public cpDetail: IcpDetail[] = [];
  public isSpinnerActive: boolean = true;
  public isLeadDetailsSpinnerActive: boolean = true;
  public cpDetails: string[];
  public leadDetails: string[] = [];
  public new_opportunity: string;
  public missedFollowUpNumber: string;
  public missedCallDetail: string;
  public todaysFollowup: string;
  public todaySiteVisit: string;
  public todays_Reminder: string;
  public totalCallCount: number;
  public totalTalktime: number;
  public Modal_Title: string;
  public DetailList: string[] = [];
  public isLoading: boolean;
  public listlength: number;
  public DataNotFoundError: any;
  public showDataNotFoundError: boolean;
  public allReferralId: string[] = [];
  public referralInfo: string[] = [];
  public allCpCroId: any[] = [];
  public totalLeads: number[];
  public totalCp: number[];
  public totalBooking: number[];
  public totalSiteVisit: number[];
  public filterAllCp: any;
  public p3: number;
  public p2: number;
  public p1: number;
  public cpDetailsNodataFound: boolean = false;
  public filterDataModel: IfilterDataModel = <IfilterDataModel>{};
  public ListOffilter = [
    { item: 'CPName' },
    { item: 'Organization' },
    { item: 'MobileNo' },
    { item: 'City' },
    { item: 'State' }
  ];
  public showModalSubscription: Subscription;
  public getCountSubscription: Subscription;
  public leadDeatilSubscription: Subscription;
  public cpDeatilSubscription: Subscription;
  public organisationDetailSubscription: Subscription;
  public cpScheduleDetailSubscription: Subscription;
  public allCpDetailsSubscription: Subscription;

  @ViewChild('leadDetailsModel', { static: false }) public leadDetailsModel: ModalDirective;
  @ViewChild('showModal', { static: false }) public showModal: ModalDirective;
  @Output() emitEvent = new EventEmitter<any>();
  @Output() emitEventoppo = new EventEmitter<any>();
  public NotFoundError: string;


  constructor(private sharedService: SharedService,
    private powerSalesDashboardService: PowerSalesDashboardService,
    private excelService: ExcelService,
    public router: Router) { }

  ngOnInit() {
    // if (localStorage.getItem('LoggedinUser')) {
    this.loggedInuserDetails = JSON.parse(localStorage.getItem('LoggedinUser'));
    this.get_Count();
    this.cpScheduleDetails();
    // }
  }
  // ***** Go to Cp Details Tab with Cp details*****//
  showDashboard = (details) => {
    this.cpDetails = details;
    this.cpDetails['EntityId'] = details.CPId;
    this.cpDetails['UserType'] = 'ChannelPartner';
    this.emitEvent.emit({ id: this.cpDetails, allCpCroId: this.allCpCroId });
    this.sharedService.shareLeadDetails("tab19");
  }
  showleadDetails = (details) => {
    //************* Lead Details related to that CP **************//
    this.leadDetailsModel.show();
    this.isLeadDetailsSpinnerActive = true;
    this.leadDeatilSubscription = this.powerSalesDashboardService.getCpLeadDetails(this.loggedInuserDetails, details.CPId).subscribe((response) => {
      if (response['exception'] === "No Data Found") {
        this.NotFoundError = response['exception'];
        this.showDataNotFoundError = true;
      } else {
        this.showDataNotFoundError = false;
        if (response && response["data"]) {
          this.leadDetails = response["data"];
          this.leadDetails.forEach(element => {
            this.allReferralId.push(element['ReferralId'])
          });
        }
      }
      this.isLeadDetailsSpinnerActive = false;
    });
    //************* End **************//
  }
  // ***** Go to lead Details Tab with Lead *****//
  gotoLeadDetails = (details) => {
    this.referralInfo['LeadId'] = details.ReferralId;
    this.referralInfo['allId'] = this.allReferralId;
    this.emitEventoppo.emit(this.referralInfo);
    this.sharedService.shareLeadDetails('tab15');
  }
  get_Count = () => {
    //************* Get Count For Dashboard **************// 
    this.getCountSubscription = this.powerSalesDashboardService.Get_Count(this.loggedInuserDetails).subscribe((response) => {
      if (response && response['data']) {
        this.new_opportunity = response['data'][0][0].NewOpportunity;
        this.missedFollowUpNumber = response['data'][1][0].MissedFollowUp;
        this.missedCallDetail = response['data'][2][0].MissedCall;
        this.todaysFollowup = response['data'][3][0].TodaysFollowUp;
        this.todays_Reminder = response['data'][4][0].Reminder;
        this.totalCallCount = response['data'][5][0].TotalCount;
        this.totalTalktime = response['data'][6][0].Talktime;
      }
    });
    //************* End **************//
  }
  //**************For Exporting Filtered data************* */
  exportEvent = (cpDetail) => {
    if (cpDetail && cpDetail.length > 0) {
      this.excelService.exportAsExcelFile(cpDetail, 'ExcelSheet');
    }
  }

  Show_Modal = (status) => {
    //************* Display Heading of Modal **************// 
    if (status == 'New_Opportunity') this.Modal_Title = "New Opportunity Details";
    if (status == 'Missed_Calls') this.Modal_Title = "Missed Calls Details";
    if (status == 'Missed_Followup') this.Modal_Title = "Missed Follow-Up Details";
    if (status == 'Today_Followup') this.Modal_Title = "Today's Follow-Up Details";
    if (status == 'Today_Sitevisit') this.Modal_Title = "Today's Site Visit Details";
    if (status == 'Reminder') this.Modal_Title = "Today's Reminder Details";
    if (status == 'By_Sales') this.Modal_Title = "Site Visit Details By Sales";
    if (status == 'By_Presales') this.Modal_Title = "Site Visit Details By Presales";
    this.DetailList = [];
    this.isLoading = true;
    this.showModal.show();
    //************* Get Details to show in Modal **************// 
    this.showModalSubscription = this.powerSalesDashboardService.DetailsForModal(this.loggedInuserDetails, status).subscribe((response) => {
      if (response && response['data']) {
        this.DetailList = response['data'];
        this.listlength = this.DetailList.length;
        this.isLoading = false;
        this.DetailList.forEach(element => {
          this.allReferralId.push(element['ReferralId'])
        });
      }
    });
    //************* End **************//
  }
  // ***** Cp Details *****//
  cpScheduleDetails = () => {
    this.isSpinnerActive = true;
    this.cpScheduleDetailSubscription = this.powerSalesDashboardService.cpSiteScheduleTile(this.loggedInuserDetails).subscribe((response) => {
      if (response && response['data']) {
        this.cpDetail = response["data"][0];
        this.totalSiteVisit = response['data'][1][0].TotalSiteVisit;
        this.totalBooking = response['data'][2][0].TotalBookings;
        this.totalCp = response['data'][3][0].TotalCP;
        this.totalLeads = response['data'][4][0].TotalLeads;
        this.cpDetail.forEach(element => {
          this.allCpCroId.push(element.CPId)
        });
        this.filterAllCp = this.cpDetail;
        this.cpDetailsNodataFound = false;
      } else {
        this.cpDetailsNodataFound = true;
      }
      this.isSpinnerActive = false;
    });
  }
  filterCPData = () => {
    let counter = 0;
    this.ListOffilter.map(element => {
      if (element && this.filterDataModel[element.item]) {
        let Data = counter > 0 ? this.cpDetail : this.filterAllCp;
        this.cpDetail = Data.filter(x => x[element.item] && x[element.item].toString().toLowerCase().indexOf(String(this.filterDataModel[element.item]).toLowerCase()) !== -1);
        counter++;
      }
    });
    this.cpDetail = counter === 0 ? this.filterAllCp : this.cpDetail;
  }
  trackByFn(item) {
    return item.id; // unique id corresponding to the item
  }
  ngOnDestroy() {
    this.showModalSubscription ? this.showModalSubscription.unsubscribe() : null;
    this.getCountSubscription ? this.getCountSubscription.unsubscribe() : null;
    this.leadDeatilSubscription ? this.leadDeatilSubscription.unsubscribe() : null;
    this.cpDeatilSubscription ? this.cpDeatilSubscription.unsubscribe() : null;
    this.organisationDetailSubscription ? this.organisationDetailSubscription.unsubscribe() : null;
    this.cpScheduleDetailSubscription ? this.cpScheduleDetailSubscription.unsubscribe() : null;
    this.allCpDetailsSubscription ? this.allCpDetailsSubscription.unsubscribe() : null;
  }
}

