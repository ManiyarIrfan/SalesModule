import { Component, OnInit, OnDestroy, EventEmitter, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import * as c3 from "c3";
import * as d3 from "d3";
import { Subscription } from 'rxjs';
import { FrontDeskLeadStatusService } from 'src/app/shared/services/employee/front-desk-lead-status.service';
import { ExcelService } from 'src/app/shared/services/shared/excel.service';
import { SharedService } from 'src/app/shared/services/shared/shared.service';
import { EncryptDecryptService } from 'src/app/shared/services/shared/encrypt-decrypt.service';
import { PreSalesLeadsService } from 'src/app/shared/services/employee/pre-sales-leads.service';
import { IfilterFrontDeskLeadStatus } from 'src/app/shared/models/employeeModel/FilterDetails.model';
import { IloggedInuserDetails } from 'src/app/shared/models/Authentication/loggedInuserDetails.model';

@Component({
  selector: 'tru-front-desk-lead-status',
  templateUrl: './front-desk-lead-status.component.html',
  styleUrls: ['./front-desk-lead-status.component.scss']
})
export class FrontDeskLeadStatusComponent implements OnInit, OnDestroy {
  public filterDataModel: IfilterFrontDeskLeadStatus = <IfilterFrontDeskLeadStatus>{};
  public loggedInuserDetails: IloggedInuserDetails = <IloggedInuserDetails>{};
  public referralDetails: string[] = [];
  public isLoading: boolean = false;
  public referralException: boolean = false;
  public selectedDateRange: { startDate: moment.Moment, endDate: moment.Moment };
  public StartDate: any;
  public EndDate: any;
  public MarketingData = [];
  public FrontDeskModel = [];
  public SwitchButtonName: string = 'Source Analysis';
  public SwitchSummeryName: string = 'Show Summary';
  public Count: number = 0;
  public SiteVisitCount: number = 0;
  public isPieChartLoading: boolean = false;
  public MarketingComponantShow: boolean = false;
  public pieChartDataNotFoundMessage: any;
  public arrString: string;
  public byProjectDetails: any[] = [];
  public bySalesDetails: any = [];
  public byPresalesDetails: any = [];
  public Showsummery: boolean = false;
  public presalesindex: number = 0;
  public salesindex: number = 0;
  public SortPichart: string;
  public projectindex: number = 0;
  public allReferralId: string[] = [];
  public filterAllPresalesLead: string[] = [];
  public Referredby: string;
  public Status: string;
  public presales: string;
  public sales: string;
  public frontdesk: string;
  public project: string;
  public source: string;
  public Name: string;
  public LeadId: string;
  public EnquiryId: string;
  public SummaryName: string = "";
  public PreferredProjectInfo: string[] = [];
  public getEnquirySummaryData = [];
  public ProjectId: string = null;
  public tableheader: string = '';
  public TotalEnquirySummary: number = 0;
  public NoSummaryData: boolean = false;
  public projectNameId: string;
  public p2: number = 1;
  public projectListSubscription: Subscription;
  public getEnquirySummarySubscription: Subscription;
  public todaysLeadDetailsSubscription: Subscription;
  public summuryDetailsSubscription: Subscription;
  public bindPieChartSubscription: Subscription;
  public filterStatus: any = [
    { key: "incoming", value: "Incoming" },
    { key: "prospect", value: "Prospect" },
    { key: "warm", value: "Warm" },
    { key: "hot", value: "Hot" },
    { key: "cold", value: "Cold" },
    { key: "unqualified", value: "Unqualified" },
    { key: "lost", value: "Lost" }];

  public DropDownData: any = [
    { key: "By Leads", value: "NoOfLeads" },
    { key: "By Enquiries", value: "NoOfEnquiries" },
    { key: "By Site Visits", value: "NoOfSiteVisits" },
    { key: "By Bookings", value: "NoOfBookings" }]

  public SummaryNameList: any = [
    { key: 'BySource', value: 'By Source' },
    { key: 'ByProject', value: 'By Project' },
    { key: 'ByCampaign', value: 'By Campaign' }];

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
    { item: 'EnquiryId' },
    { item: 'LeadId' },
    { item: 'Name' },
    { item: 'Source' },
    { item: 'ProjectName' },
    { item: 'frontdesk' },
    { item: 'SalesAgentAssinged' },
    { item: 'PresalesAgentName' },
    { item: 'ReferralStatus' },
    { item: 'ReferralBy' },
    { item: 'TReferralId' },
    { item: 'CreatedBy' }];

  @Output() emitEventoppo = new EventEmitter<any>();

  constructor(private frontDeskLeadStatusService: FrontDeskLeadStatusService,
    private excelService: ExcelService,
    public router: Router, public sharedService: SharedService,
    private encryptDecryptService: EncryptDecryptService,
    private preSalesLeadsService: PreSalesLeadsService) { }

  ngOnInit() {
    this.FrontDeskModel['SortPichart'] = '';
    this.selectedDateRange = { startDate: moment(), endDate: moment() };
    this.loggedInuserDetails = JSON.parse(localStorage.getItem('LoggedinUser'));
    if (this.loggedInuserDetails) {
      if (sessionStorage.frontdeskleadstatus) {
        var Data = JSON.parse(sessionStorage.getItem('frontdeskleadstatus'));
        let decryptData = this.encryptDecryptService.decryptData(Data);
        this.MarketingData = decryptData[0]['MarketingData'] ? decryptData[0]['MarketingData'] : [];
        let PiData = [];
        this.SummaryName = '';
        this.ProjectId = '';
        PiData['SortPichart'] = 'NoOfLeads';
        this.Showsummery = decryptData[0]['Showsummery'];
        this.MarketingComponantShow = decryptData[0]['MarketingComponantShow'];
        this.Count = this.MarketingComponantShow === true ? 1 : 0;
        this.SwitchButtonName = this.Count === 1 ? ' Site Visit ' : 'Source Analysis';
        this.SwitchSummeryName = this.byPresalesDetails === true ? ' Show Site Visit' : 'Show Summary';
        this.referralException = decryptData[0]['referralException'];
        this.referralDetails = decryptData[0]['referralDetails'].length > 0 ? decryptData[0]['referralDetails'] : [];
        this.byProjectDetails = decryptData[0]['byProjectDetails'].length > 0 ? decryptData[0]['byProjectDetails'] : [];
        this.byPresalesDetails = decryptData[0]['byPresalesDetails'].length > 0 ? decryptData[0]['byPresalesDetails'] : [];
        this.bySalesDetails = decryptData[0]['bySalesDetails'].length > 0 ? decryptData[0]['bySalesDetails'] : [];
        this.SiteVisitCount = decryptData[0]['SiteVisitCount'] ? decryptData[0]['SiteVisitCount'] : '';
        this.filterAllPresalesLead = decryptData[0]['filterAllPresalesLead'] ? decryptData[0]['filterAllPresalesLead'] : '';
        this.p2 = decryptData[0]['p2'] ? decryptData[0]['p2'] : 1;
        this.PichartSorting(PiData);
        this.StartDate = decryptData[0]['StartDate'];
        this.EndDate = decryptData[0]['EndDate'];
      } else {
        this.StartDate = new Date().toLocaleDateString();
        this.EndDate = new Date().toLocaleDateString();
        this.todaysLeadDetails(this.StartDate, this.EndDate);
      }
    }
    this.GetProjectNameList();
  }
  GetProjectNameList = () => {
    //-------Get All Projects name-------//
    this.projectListSubscription = this.preSalesLeadsService.GetAllProjectName(this.loggedInuserDetails).subscribe((response) => {
      if (response && response["data"]) {
        this.PreferredProjectInfo = response["data"];
      }
    });
    //-------End-------//
  }
  pageChangeEvent() {
    this.SessionHistory();
  }
  onChangeProject = (ProjectId) => {
    //---change employee Id and get result of Enquiry---//
    this.projectNameId = ProjectId;
    this.StartDate = this.StartDate ? this.StartDate : moment();
    this.EndDate = this.EndDate ? this.EndDate : moment();
  }
  getEnquirySummary = () => {
    if (this.SummaryName != 'select') {
      if (this.selectedDateRange != undefined && this.selectedDateRange['startDate'] != null && this.selectedDateRange['endDate'] != null) {

        switch (this.SummaryName) {
          case 'BySource': this.tableheader = 'Source';
            break;
          case 'ByProject': this.tableheader = 'Project';
            this.ProjectId = null;
            break;
          case 'ByCampaign': this.tableheader = 'Campaign';
            break;
        }
        this.StartDate = this.selectedDateRange['startDate'].format('YYYY-MM-DD');;
        this.EndDate = this.selectedDateRange['endDate'].format('YYYY-MM-DD');;
        this.isLoading = true;
        this.getEnquirySummarySubscription = this.preSalesLeadsService.getEnquirySummary(this.loggedInuserDetails, this.StartDate, this.EndDate, this.SummaryName, (this.ProjectId && this.ProjectId !== '') ? this.ProjectId : null).subscribe((response) => {
          this.getEnquirySummaryData = (response && response["data"][0] && response["data"][0].length > 0) ? response["data"][0] : [];
          this.TotalEnquirySummary = response["data"][1][0] ? response["data"][1][0]['TotalEnquiry'] : null;
          this.getEnquirySummaryData = (this.TotalEnquirySummary && this.TotalEnquirySummary !== 0) ? this.getTotalCount(this.getEnquirySummaryData) : [];
          this.NoSummaryData = this.getEnquirySummaryData.length > 0 ? false : true;
          this.isLoading = false;
        });
      }
    } else {
      this.getEnquirySummaryData = [];
    }
  }
  //******* Horizontally and Vertically Sum of All Data ******//
  getTotalCount = (details) => {
    details.forEach(element => {
      let total = 0;
      let columnName = Object.keys(element);
      columnName.forEach(item => {
        let data = this.filterStatus.filter(x => x.key === item.toLocaleLowerCase());
        if (data.length > 0) {
          total += element[item] ? element[item] : 0;
        }
      });
      element['Total'] = total;
    });
    let TotalCount = [];
    TotalCount.push({ ColName: 'Total' });
    this.filterStatus.map(element => {
      let sum = 0;
      sum = details.reduce((a, b) => +a + +b[element.value], 0);
      TotalCount[0][element.value] = sum;
    });
    details.push(TotalCount[0]);
    let index = details.findIndex(x => x.ColName === 'Total');
    if (index !== -1) {
      details[index].Total = this.TotalEnquirySummary;
    }
    return details;
  }
  onChangeDate = (selectedDateRange) => {
    if (selectedDateRange !== undefined && selectedDateRange.startDate !== null && selectedDateRange.endDate !== null) {
      //********* when date range change *********//      
      // this.StartDate = selectedDateRange.startDate.format('YYYY-MM-DD'); 
      // this.EndDate = selectedDateRange.endDate.format('YYYY-MM-DD');
      this.StartDate = selectedDateRange.startDate._d.toDateString();
      this.EndDate = selectedDateRange.endDate._d.toDateString();
      // this.StartDate = selectedDateRange.startDate.toISOString().slice(0, 10);
      // this.EndDate = selectedDateRange.endDate.toISOString().slice(0, 10);
      if (this.SwitchButtonName === 'Source Analysis') {
        this.todaysLeadDetails(this.StartDate, this.EndDate);
      } else {
        this.BindPieChart(this.StartDate, this.EndDate);
      }
      this.getReportSummery()
      //********* End *********// 
    }
  }

  filterLeadData = () => {
    let counter = 0;
    this.ListOffilter.map(element => {
      if (element && this.filterDataModel[element.item]) {
        let Data = counter > 0 ? this.referralDetails : this.filterAllPresalesLead;
        this.referralDetails = Data.filter(x => x[element.item] && x[element.item].toString().toLowerCase().indexOf(String(this.filterDataModel[element.item]).toLowerCase()) !== -1);
        counter++;
      }
    });
    this.referralDetails = counter === 0 ? this.filterAllPresalesLead : this.referralDetails;
  }

  todaysLeadDetails = (startDate, endDate) => {
    //*********  Todays all lead information in grid *********//
    this.isLoading = true;
    this.filterAllPresalesLead = [];
    this.referralDetails = [];
    this.todaysLeadDetailsSubscription = this.frontDeskLeadStatusService.getTodaysCreatedLead(this.loggedInuserDetails, startDate, endDate).subscribe((response) => {
      if (response && response["data"] && response["data"][0]) {
        this.referralDetails = response["data"];
        this.referralException = false;
        this.referralDetails.forEach(element => {
          this.allReferralId.push(element['ReferralId'])
        });
        this.filterAllPresalesLead = this.referralDetails;
        this.isLoading = false;
      } else {
        this.referralException = true;
        this.isLoading = false;
      }
      this.SessionHistory();

    });
    //********* End *********//
  }
  //********* Goto Lead Details Tab *********//
  gotoReferralDetails = (referral) => {
    let referralInfo = []
    referralInfo['LeadId'] = referral.ReferralId;
    referralInfo['allId'] = this.allReferralId;
    this.emitEventoppo.emit(referralInfo);
    this.sharedService.shareLeadDetails('tab15');
  }

  exportEvent() {
    //*********  Export All Referral Details From Table *********//
    this.excelService.exportAsExcelFile(this.referralDetails, 'ExcelSheet');
    //********* End *********//
  }
  switchToMarketing() {
    //********* Switch beetween(Todays all lead information in grid & Marketing Analysis*********//
    if (this.Count === 0) {
      this.MarketingComponantShow = true;
      this.Count = 1;
      this.SwitchButtonName = 'Site Visit';
      this.referralException = false;
      //this.BindPieChart(this.StartDate, this.EndDate);
      this.SessionHistory();
    } else {
      this.Count = 0;
      this.MarketingComponantShow = false;
      this.referralException = true;
      this.SwitchButtonName = 'Source Analysis';
      //this.todaysLeadDetails(this.StartDate, this.EndDate);
      this.SessionHistory();
    }
    //********* End *********//
  }

  switchToSummery() {
    //********* Switch beetween(Todays all lead information in grid & Marketing Analysis*********//
    if (this.Count === 0) {
      this.Count = 1;
      this.SwitchSummeryName = ' Show Site Visit';
      this.Showsummery = true;
      //this.todaysLeadDetails(this.StartDate, this.EndDate);
      //this.getReportSummery();
      this.SessionHistory();
    } else {
      this.Count = 0;
      this.Showsummery = false;
      this.SwitchSummeryName = ' Show Summary';
      this.SessionHistory();
    }
    //********* End *********//
  }

  PichartSorting(FrontDeskModel) {
    if (FrontDeskModel) {
      this.isPieChartLoading = true;
      let dataToBind = [];
      this.MarketingData.forEach(element => {
        dataToBind.push([element.Source, parseInt(element[FrontDeskModel.SortPichart])]);
      });
      this.isPieChartLoading = false;
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
      this.pieChartDataNotFoundMessage = '';
    }
  }
  BindPieChart = (startDate, endDate) => {
    //********* Get API Marketing Analysis fill table and Pi-chart*********//
    this.isPieChartLoading = true;
    if (startDate !== null && endDate !== null) {
      this.bindPieChartSubscription = this.frontDeskLeadStatusService.getReportMarketingAnalysis(this.loggedInuserDetails, startDate, endDate).subscribe((response) => {
        if (response['exception'] && response['exception'] === "No Data Found") {
          this.pieChartDataNotFoundMessage = response['exception'];
        } else {
          let dataToBind = [];
          this.MarketingData = response["data"] ? response["data"] : [];
          response["data"].forEach(element => {
            dataToBind.push([element.Source, element.NoOfEnquiries]);
            this.isPieChartLoading = false;
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
          this.SessionHistory();
        }
      });
    }
    //********* End *********//
  }

  //Select Summery Report for Selected Date range
  getReportSummery = () => {
    let startDate = this.StartDate;
    let endDate = this.EndDate;
    this.isLoading = true;
    this.byPresalesDetails = [];
    this.bySalesDetails = [];
    this.summuryDetailsSubscription = this.frontDeskLeadStatusService.getReportSummery(this.loggedInuserDetails, startDate, endDate
    ).subscribe((response) => {
      if (response && response["data"] && response["data"][0]) {
        this.byProjectDetails = response["data"][0] ? response["data"][0] : [];
        const sum = this.byProjectDetails
          .map(v => v['NoOfLeads'])
          .reduce((sum, current) => sum + current, 0);
        this.SiteVisitCount = sum;
        this.byPresalesDetails = response["data"][1] ? response["data"][1] : [];
        this.bySalesDetails = response["data"][2] ? response["data"][2] : [];
        this.referralException = false;
        this.SessionHistory();
      } else {
        this.referralException = true;
        this.SessionHistory();
      }
      this.isLoading = false;
    });
  }
  SessionHistory() {
    let Data = [];
    Data.push({
      MarketingData: this.MarketingData.length > 0 ? this.MarketingData : [],
      dataToBind: [],
      Showsummery: this.Showsummery,
      MarketingComponantShow: this.MarketingComponantShow,
      isLoading: this.isLoading,
      referralException: this.referralException,
      referralDetails: this.referralDetails.length > 0 ? this.referralDetails : [],
      byProjectDetails: this.byProjectDetails.length > 0 ? this.byProjectDetails : [],
      byPresalesDetails: this.byPresalesDetails.length > 0 ? this.byPresalesDetails : [],
      bySalesDetails: this.bySalesDetails.length > 0 ? this.bySalesDetails : [],
      selectedDateRange: this.selectedDateRange['startDate'] ? this.selectedDateRange : null,
      SiteVisitCount: this.SiteVisitCount,
      filterAllPresalesLead: this.filterAllPresalesLead.length > 0 ? this.filterAllPresalesLead : [],
      p2: this.p2,
      StartDate: this.StartDate,
      EndDate: this.EndDate,
      Count: this.Count,
      SwitchButtonName: this.SwitchButtonName,
    });
    let EncryptedData = this.encryptDecryptService.encryptData(Data);
    sessionStorage.setItem('frontdeskleadstatus', JSON.stringify(EncryptedData));
  }
  //* Click method for show multiple site visit *//
  SiteVisitClick = () => {
    if (this.referralDetails && this.referralDetails.length === 0) {
      this.todaysLeadDetails(this.StartDate, this.EndDate)
    }
    let sitevisitdata = this.referralDetails.filter(x => x['NoOfSiteVisit'] > 1);
    this.referralDetails = sitevisitdata;
  }

  trackByFn(item) {
    return item.id; // unique id corresponding to the item
  }
  ngOnDestroy() {
    //********* Unsubscribe All Service *********//
    this.getEnquirySummarySubscription ? this.getEnquirySummarySubscription.unsubscribe() : null;
    this.projectListSubscription ? this.projectListSubscription.unsubscribe() : null;
    this.todaysLeadDetailsSubscription ? this.todaysLeadDetailsSubscription.unsubscribe() : null;
    this.bindPieChartSubscription ? this.bindPieChartSubscription.unsubscribe() : null;
    this.summuryDetailsSubscription ? this.summuryDetailsSubscription.unsubscribe() : null;
  }
}
