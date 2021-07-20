import { Component, OnInit, ViewChild, EventEmitter, Output, HostListener, OnDestroy } from '@angular/core';
import * as c3 from "c3";
import * as d3 from "d3";
import { ModalDirective } from 'ngx-bootstrap';
import * as moment from 'moment';
import { EmpAnalyticsService } from 'src/app/shared/services/employee/emp-analytics.service';
import { SharedService } from 'src/app/shared/services/shared/shared.service';
import { ItotalSalesData, ItotalpreSalesData, ItotalSiteLevelData, IfilterDataModel, ISearchModel, IFIlterTable } from 'src/app/shared/models/employeeModel/employeeAnalytics.model';
import { MatSnackBar } from '@angular/material';
import { IloggedInuserDetails } from 'src/app/shared/models/Authentication/loggedInuserDetails.model';
import { Subscription } from 'rxjs';
import { AdminPanelService } from 'src/app/shared/services/employee/admin-panel.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'tru-employee-analytics',
  templateUrl: './employee-analytics.component.html',
  styleUrls: ['./employee-analytics.component.scss']
})
export class EmployeeAnalyticsComponent implements OnInit, OnDestroy {
  @ViewChild('showModal', { static: false }) public showModal: ModalDirective;
  @ViewChild('showsalesPresalesModal', { static: false }) public showsalesPresalesModal: ModalDirective;
  @ViewChild('showFeedbackModal', { static: false }) public showFeedbackModal: ModalDirective;
  @Output() emitEvent = new EventEmitter<any>();
  @Output() emitopportunityEvent = new EventEmitter<any>();
  public totalSalesData: ItotalSalesData = <ItotalSalesData>{};
  public totalpreSalesData: ItotalpreSalesData = <ItotalpreSalesData>{};
  public totalSiteLevelData: ItotalSiteLevelData = <ItotalSiteLevelData>{};
  public filterDataModel: IfilterDataModel = <IfilterDataModel>{};
  public filterData: IFIlterTable = <IFIlterTable>{};
  public searchModel: ISearchModel = <ISearchModel>{};
  public loggedInuserDetails: IloggedInuserDetails = <IloggedInuserDetails>{};
  public isPieChartLoading: boolean = false;
  public isChartLoading: boolean = false;
  public isDougnetChartLoading: boolean = false;
  public arrString: string[];
  public barChartDataNotFoundMessage: string;
  public donutDataNotFoundMessage: boolean = false;
  public pieChartDataNotFoundMessage: boolean;
  public missedFollowUpNumber: number;
  public q1: number;
  public r1: number;
  public q112: number;
  public todaysFollowup: number;
  public todaySiteVisit: number;
  public todays_Reminder: number;
  public totalCallCount: number;
  public totalTalktime: number;
  public MyTodaysWork: number;
  public SiteVisitConducted: number;
  public BookedLeads: number;
  public HotLeads: number;
  public NoActionPlanned: number;
  public by_sales: string;
  public by_presales: string;
  public by_cp: string;
  public Modal_Title: string;
  public isLoading: boolean = false;
  public DetailList: string[] = [];
  public listlength: number;
  public Untouched: string;
  public isLoadingStops: boolean = false;
  // public enquiryDetails: any;
  public id: number;
  public salesData: string[];
  public presalesData: string[];
  public siteLevelData: string[] = [];
  public showSalesPresalesTiles: boolean = false;
  public showSalesData: boolean = false;
  public salesPresales: boolean;
  public showsalesPresaslesData: string[] = [];
  public TempFilteredData: string[] = [];
  public statusFlag: string = '';
  public followUpFlag: boolean = false;
  public siteVisitFlag: boolean = false;
  selected: { startDate: moment.Moment, endDate: moment.Moment };
  public selectedDateRange: object;
  public StartDate: any;
  public EndDate: any;
  public showtoManager: boolean = false;
  public allReferralId: string[] = [];
  public referralInfo: string[] = [];
  public p: number = 1;
  public storeData: string[] = [];
  public storeFeedbackData: string[] = [];
  public feedbackData: string[] = [];
  public f1: number;
  public TotalSVConduct: number;
  public TotalBookings: number;
  public salesPresalesData: any[] = [];
  public getPresalesName: string[] = [];
  public getProjectNames: string[] = [];

  private _empAnalyticsSubscription: Array<Subscription> = [];

  public ranges: any = {
    'Today': [moment(), moment()],
    'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
    'Last 7 Days': [moment().subtract(6, 'days'), moment()],
    'Last 30 Days': [moment().subtract(29, 'days'), moment()],
    'This Month': [moment().startOf('month'), moment()],
    'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
    'Last 6 Months': [moment().subtract(6, 'month'), moment()]
  };
  public ListOffilter = [
    { item: 'Name' }, { item: 'BrokerName' }, { item: 'MobileNo' },
    { item: 'Source' }, { item: 'FeedbackFrom' }, { item: 'UserType' },
    { item: 'Details' }
  ];
  public ListOffilterValue = [
    { item: 'Name' }, { item: 'Role' }, { item: 'Project' },
    { item: 'Total_Calls' }, { item: 'Total_Talktime' }, { item: 'SiteVisit_Scheduled' },
    { item: 'SiteVisit_Conducted' }, { item: 'Bookings' }];

  constructor(
    private empAnalyticService: EmpAnalyticsService,
    private sharedService: SharedService,
    private adminSer: AdminPanelService,
    private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.loggedInuserDetails = JSON.parse(localStorage.getItem('LoggedinUser'));
    if (this.loggedInuserDetails) {
      this.selectedDateRange = { startDate: moment().subtract(1, 'days'), endDate: moment().subtract(1, 'days') };
      this.StartDate = moment().subtract(1, 'days')
      this.EndDate = moment().subtract(1, 'days')
      this.get_Count(this.StartDate.format('YYYY-MM-DD'), this.EndDate.format('YYYY-MM-DD'));
      this.BindBarChart();
      this.BindDonutChart();
      this.BindPieChart();
      this.getEmployeeList();
      this.selected = { startDate: moment().subtract(30, 'days'), endDate: moment() };
      this.showCallReportDetails(this.selected, null);

      this.showtoManager = this.loggedInuserDetails.Role === 9 || this.loggedInuserDetails.Role === 11 || this.loggedInuserDetails.Role === 2 || this.loggedInuserDetails.Role === 1 ? true : false;
    }
  }

  //************* Get Count For Dashboard **************// 
  get_Count = (startDate, endDate) => {
    const Get_CountSub = this.empAnalyticService.Get_Count(this.loggedInuserDetails, startDate, endDate)
      .subscribe((response) => {
        if (response && response['data']) {
          this.missedFollowUpNumber = response['data'][0][0].MissedFollowUp ? response['data'][0][0].MissedFollowUp : 0;
          this.todaysFollowup = response['data'][2][0] && response['data'][2][0].TodaysFollowUp ? response['data'][2][0].TodaysFollowUp : 0;
          this.todaySiteVisit = response['data'][3][0] && response['data'][3][0].TodaysSiteVisit ? response['data'][3][0].TodaysSiteVisit : 0;
          this.todays_Reminder = response['data'][4][0] && response['data'][4][0].Reminder ? response['data'][4][0].Reminder : 0;
          this.totalCallCount = response['data'][5][0] && response['data'][5][0].TotalCalls ? response['data'][5][0].TotalCalls : 0;
          this.totalTalktime = response['data'][6][0] && response['data'][6][0].Talktime ? response['data'][6][0].Talktime : 0;
          this.by_sales = response['data'][7][0] && response['data'][7][0].BySales ? response['data'][7][0].BySales : 0;
          this.by_presales = response['data'][8][0] && response['data'][8][0].ByPresales ? response['data'][8][0].ByPresales : 0;
          this.MyTodaysWork = response['data'][12][0] && response['data'][12][0].MyTodaysWork ? response['data'][12][0].MyTodaysWork : 0;
          this.NoActionPlanned = response['data'][13][0] && response['data'][13][0].NoActionPlanned ? response['data'][13][0].NoActionPlanned : 0;
          this.HotLeads = response['data'][14][0] && response['data'][14][0].HotLeads ? response['data'][14][0].HotLeads : 0;
          this.SiteVisitConducted = response['data'][15][0] && response['data'][15][0].SiteVisitConducted ? response['data'][15][0].SiteVisitConducted : 0;
          this.BookedLeads = response['data'][16][0] && response['data'][16][0].BookedLeads ? response['data'][16][0].BookedLeads : 0;
          this.by_cp = response['data'][17][0] && response['data'][17][0].ByCP ? response['data'][17][0].ByCP : 0;
        }
      });
    this._empAnalyticsSubscription.push(Get_CountSub);
  }

  //************ when date range change *************// 
  onChangeDate = (selected) => {
    if (selected !== undefined && selected.startDate !== null && selected.endDate !== null) {
      this.StartDate = selected.startDate;
      this.EndDate = selected.endDate;
      this.StartDate = this.StartDate.format('YYYY-MM-DD');
      this.EndDate = this.EndDate.format('YYYY-MM-DD');
      this.get_Count(this.StartDate, this.EndDate);
    }
  }

  //************* Display Heading of Modal **************//
  Show_Modal = (status) => {
    this.statusFlag = status;
    this.followUpFlag = this.siteVisitFlag = false;
    switch (status) {
      case 'MyTodaysWork':
        this.followUpFlag = true;
        this.Modal_Title = "My Todays Work Details";
        break;
      case 'Missed_Followup':
        this.followUpFlag = true;
        this.Modal_Title = "Missed FollowUp Details";
        break;
      case 'Hot':
        this.followUpFlag = true;
        this.Modal_Title = "Hot Leads Details";
        break;
      case 'NoActionPlanned':
        this.followUpFlag = true;
        this.Modal_Title = "No Action Planned Details";
        break;
      case 'Today_Followup':
        this.followUpFlag = true;
        this.Modal_Title = "Today's Follow-Up Details";
        break;
      case 'Today_Sitevisit':
        this.siteVisitFlag = true;
        this.Modal_Title = "Today's Site Visit Details";
        break;
      case 'Reminder':
        this.followUpFlag = true;
        this.Modal_Title = "Today's Reminder Details";
        break;
      case 'By_Sales':
        this.siteVisitFlag = true;
        this.Modal_Title = "Site Visit Details By Sales";
        break;
      case 'By_Presales':
        this.siteVisitFlag = true;
        this.Modal_Title = "Site Visit Details By Presales";
        break;
      case 'Untouched_Leads':
        this.Modal_Title = "Untouched Lead Details";
        break;
      case 'Total_Calls':
        this.Modal_Title = "Total Call Details";
        break;
      case 'BookedLeads':
        this.Modal_Title = "Booked Lead Details";
        break;
      case 'SiteVisitConducted':
        this.Modal_Title = "Site Visit Conducted Details";
        break;
      case 'By_CP':
        this.Modal_Title = "Leads By CP / CRO";
        break;
      default: break;
    }
    this.isLoading = this.isLoadingStops = true;
    this.DetailList = [];
    this.p = 1;
    this.showModal.show();
    //************* Get Details to show in Modal **************// 
    //  For Status 'HOT', 'MYTODAYSCALL' AND 'NOACTIONPLANNED' used another API
    if ( status === 'MyTodaysWork' || status === 'NoActionPlanned') {
      this.onChangestatus('', status)
    } else {
      this.StartDate = this.StartDate ? this.StartDate : moment().format('YYYY-MM-DD');
      this.EndDate = this.EndDate ? this.EndDate : moment().format('YYYY-MM-DD');
      const DetailsForModalSub = this.empAnalyticService.DetailsForModal(this.loggedInuserDetails, status, this.StartDate, this.EndDate)
        .subscribe((response) => {
          if (response && response['data']) {
            this.storeData = this.DetailList = response['data'];
            this.listlength = this.DetailList.length;
            this.isLoading = this.isLoadingStops = false;
            this.allReferralId = [];
            this.filterDataModel = <IfilterDataModel>{};
            this.DetailList.forEach(element => {
              this.allReferralId.push(element['LeadId'] ? element['LeadId'] : element['ReferralId'])
            });
          }
        });
      this._empAnalyticsSubscription.push(DetailsForModalSub);
    }
  }

  // Filter Emp analytics data
  filterEmpData = (header, data, TempData, Model, input) => {
    let counter = 0;
    header.map(element => {
      if (element && Model[element.item]) {
        let Data = counter > 0 ? data : TempData;
        data = Data.filter(x => x[element.item] && x[element.item].toString().toLowerCase().indexOf(String(Model[element.item]).toLowerCase()) !== -1);
        counter++;
      }
    });
    data = counter === 0 ? TempData : data;
    switch (input) {
      case 'showsalesPresales':
        this.showsalesPresaslesData = data;
        break;
      case 'feedbackData':
        this.feedbackData = data;
        break;
      case 'DetailList':
        this.DetailList = data;
        break;
    }
  }

  //------- Lead List Details If status === Hot, NoActionPlanned, MyTodaysWork-------//
  onChangestatus = (reportname, status) => {
    this.isLoading = this.isLoadingStops = true;
    const getleadOnStatusDetailsSub = this.empAnalyticService.getleadOnStatusDetails(this.loggedInuserDetails, reportname, status)
      .subscribe((response) => {
        if (response && response["data"]) {
          this.storeData = this.DetailList = response["data"];
          this.listlength = this.DetailList.length;
          this.allReferralId = [];
          this.filterDataModel = <IfilterDataModel>{};
          this.DetailList.forEach(element => {
            this.allReferralId.push(element['LeadId'] ? element['LeadId'] : element['ReferralId'])
          });
          this.bindReferralStatus(this.DetailList);
        }
        this.isLoading = this.isLoadingStops = false;
      });
    this._empAnalyticsSubscription.push(getleadOnStatusDetailsSub);
  }

  // for split the current Referral status
  bindReferralStatus = (showReferral) => {
    showReferral.forEach(element => {
      let arr = element.ReferralStatus.split('#**#');
      element.ReferralStatus = arr[arr.length - 1];
    });
  }

  //************* Moved to Lead details Tab **************//
  showLeadDetails = (details) => {
    if (details.UserType === 'Referral') {
      this.referralInfo['LeadId'] = details.LeadId ? details.LeadId : details.ReferralId;
      this.referralInfo['allId'] = this.allReferralId;
      this.emitopportunityEvent.emit(this.referralInfo);
      this.sharedService.shareLeadDetails('tab15');
    } else {
      this.id = details.EnquiryId;
      this.emitEvent.emit(this.id);
      this.sharedService.shareLeadDetails('tab14');
    }
    this.showModal.hide();
  }

  //************* Modal Close **************// 
  onClose = () => {
    this.showModal.hide();
    this.showsalesPresalesModal.hide();
    // this.selected = { startDate: moment(), endDate: moment() };
  }

  @HostListener('document:keyup', ['$event']) handleKeyUp(event) {
    if (event.keyCode === 27) {
      this.onClose();
    }
  }

  // get Project and Presales Names 
  getEmployeeList = () => {
    const ProjectSub = this.adminSer.GetProjectListOnSelected(this.loggedInuserDetails);
    const EmployeeListSub = this.adminSer.getEmployeeList(this.loggedInuserDetails);
    const APISub = forkJoin([ProjectSub, EmployeeListSub])
      .subscribe((response) => {
        if (response && response[0]["data"] && response[0]["data"].length > 0) {
          this.getProjectNames = response[0]['data'];
        }
        if (response && response[1]["data"] && response[1]["data"].length > 0) {
          this.getPresalesName = response[1]['data'] ? response[1]['data'].filter(x => x.Role === "PRESALES") : [];
        }
      });
    this._empAnalyticsSubscription.push(APISub);
  }

  //************* for get call Report data  **************//
  showCallReportDetails = (selected, filterData) => {
    let Temp = [];
    if (filterData !== null) {
      Temp['ProjectId'] = (filterData.ProjectId !== undefined)
        ? (filterData.ProjectId !== "--- Select Project ---")
          ? Number(filterData.ProjectId)
          : null
        : null;
      Temp['PresalesId'] = (filterData.PresalesId !== undefined)
        ? (filterData.PresalesId !== "--- Select Presales ---")
          ? Number(filterData.PresalesId)
          : null
        : null;
    }
    const getCallReportsDetailsSub = this.empAnalyticService.getCallReportsDetails(this.loggedInuserDetails, selected, Temp)
      .subscribe((response) => {
        if (response && response["data"] && response["data"][0].length > 0) {
          this.salesPresalesData = response["data"][0];
          this.siteLevelData = response["data"][1];
          this.totalSalesData = response["data"][2][0];
          this.totalpreSalesData = response["data"][3][0];
          this.totalSiteLevelData = response["data"][4][0];
        }
      });
    this._empAnalyticsSubscription.push(getCallReportsDetailsSub);
  }

  getFeedback = () => {
    const getFeedbackDetailsSub = this.empAnalyticService.getFeedbackDetails(this.loggedInuserDetails)
      .subscribe((response) => {
        if (response && response["data"]) {
          this.storeFeedbackData = this.feedbackData = response["data"];
          this.feedbackData && this.feedbackData.length > 0
            ? this.showFeedbackModal.show()
            : this.snackBar.open('No Feedback Received', null, { duration: 5000, panelClass: ['red-snackbar'] });;
        }
      });
    this._empAnalyticsSubscription.push(getFeedbackDetailsSub);
  }


  //************* for show Modal popup for indetail call report details **************//
  openSalesPresalesModel = (typeOfClick) => {
    switch (typeOfClick) {
      case 'bysales':
        this.TempFilteredData = this.showsalesPresaslesData = this.salesPresalesData.filter(x => x.Role === 'Sales');
        this.showSalesData = this.salesPresales = true;
        this.Modal_Title = "Sales Performance";
        break;
      case 'byPresales':
        this.TempFilteredData = this.showsalesPresaslesData = this.salesPresalesData.filter(x => x.Role === 'Presales');
        this.showSalesData = false;
        this.salesPresales = true;
        this.Modal_Title = "Presales Performance";
        break;
      default:
        this.salesPresales = false;
        this.Modal_Title = "Site-Level Performance";
        break;
    }
    this.TotalSVConduct = this.showsalesPresaslesData.reduce((a, b) => +a + +b['SiteVisit_Conducted'], 0)
    this.TotalBookings = this.showsalesPresaslesData.reduce((a, b) => +a + +b['Bookings'], 0)
    this.showsalesPresalesModal.show();
  }

  BindBarChart = () => {
    this.isChartLoading = true;
    const GetservicechartDetailsSub = this.empAnalyticService.GetservicechartDetails(this.loggedInuserDetails).subscribe((response) => {
      if (response['exception'] === "No Data Found") {
        this.barChartDataNotFoundMessage = response['exception'];
      }
      else {
        c3.generate({
          bindto: '#barchart',
          data: {
            type: 'bar',
            json: response["data"],
            keys: {
              x: 'IssueStatus',
              value: ['NoOfIssues']
            }
          },
          axis: {
            x: {
              type: 'category',
              onclick: function (d, i) { },
              onmouseover: function (d, i) { },
              onmouseout: function (d, i) { }
            }
          },
          bar: {
            width: {
              ratio: 0.5
            },
            label: {
              format: function (value, ratio, id) {
                return d3.format('$')(value);
              }
            }
          }
        });
      }
      this.isChartLoading = false;
    });
    this._empAnalyticsSubscription.push(GetservicechartDetailsSub);
  }

  BindDonutChart = () => {
    this.isDougnetChartLoading = true;
    const GetchartDetailsSub = this.empAnalyticService.GetchartDetails(this.loggedInuserDetails).subscribe((response) => {
      if (response && response['data'].length > 0) {
        this.donutDataNotFoundMessage = false;
        let dataToBind = [];
        response["data"].forEach(element => {
          dataToBind.push([element.OrderStatus, element.NoOfOrders]);
        });
        this.isDougnetChartLoading = false;
        if (dataToBind) {
          c3.generate({
            bindto: '#donutchart',
            data: {
              columns: dataToBind,
              type: 'donut',
              onclick: function (d, v) { },
              onmouseover: function (d, v) { },
              onmouseout: function (d, v) { }
            },
            tooltip: {
              format: {
                value: function (value, ratio, id) {
                  var format = id === 'data1' ? d3.format(',') : d3.format('');
                  return format(value);
                }
              }
            },
            donut: {
              title: "Order Status",
            }
          });
        }
      } else {
        this.donutDataNotFoundMessage = true;
      }
      this.isDougnetChartLoading = false;
    });
    this._empAnalyticsSubscription.push(GetchartDetailsSub);
  }

  BindPieChart = () => {
    this.isPieChartLoading = true;
    const GetreferralchartDetailsSub = this.empAnalyticService.GetreferralchartDetails(this.loggedInuserDetails)
      .subscribe((response) => {
        if (response && response["data"]) {
          this.pieChartDataNotFoundMessage = false;
          let dataToBind = [];
          response["data"].forEach(element => {
            if (element.ReferralStatus) {
              this.arrString = element.ReferralStatus.split('#**#');
              dataToBind.push([this.arrString[this.arrString.length - 1], element.NoOfReferrals]);
            }
          });
          c3.generate({
            bindto: '#piechart',
            data: {
              columns: dataToBind,
              type: 'pie',
              onclick: function (d, i) { },
              onmouseover: function (d, i) { },
              onmouseout: function (d, i) { }
            },
            tooltip: {
              format: {
                value: function (value, ratio, id) {
                  var format = id === 'data1' ? d3.format(',') : d3.format('');
                  return format(value);
                }
              }
            }
          });
        } else {
          this.pieChartDataNotFoundMessage = true;
        }
        this.isPieChartLoading = false;
      });
    this._empAnalyticsSubscription.push(GetreferralchartDetailsSub);
  }

  trackByFn(item) {
    return item.id; // or item.id
  }

  ngOnDestroy() {
    for (let item of this._empAnalyticsSubscription) {
      item.unsubscribe();
    }
  }
}