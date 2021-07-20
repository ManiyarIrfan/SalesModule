import { Component, OnInit, Output, EventEmitter, ViewChild, Pipe, PipeTransform, OnDestroy, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { ModalDirective, BsDatepickerConfig } from 'ngx-bootstrap';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { PreSalesLeadsService } from 'src/app/shared/services/employee/pre-sales-leads.service';
import { SharedService } from 'src/app/shared/services/shared/shared.service';
import { ExcelService } from 'src/app/shared/services/shared/excel.service';
import { LeadGenerationService } from 'src/app/shared/services/employee/lead-generation.service';
import { routerTransition } from 'src/app/router.animations';
import { FormGroup, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { IfilterpreSalesleadsModel, IenquiryRegModel, IselectedDateRange, IreassignModel, IpresalesInfoModel } from 'src/app/shared/models/employeeModel/pre-sales-leads.model';
import { EncryptDecryptService } from 'src/app/shared/services/shared/encrypt-decrypt.service';
import { IloggedInuserDetails } from 'src/app/shared/models/Authentication/loggedInuserDetails.model';

@Component({
  selector: 'tru-pre-sales-leads',
  templateUrl: './pre-sales-leads.component.html',
  styleUrls: ['./pre-sales-leads.component.scss'],
  animations: [routerTransition()]
})
@Pipe({ name: 'titlecase', pure: false })

export class PreSalesLeadsComponent implements OnInit, OnDestroy {
  @ViewChild('createPreSalesLead', { static: false }) public createPreSalesLead: ModalDirective;
  @ViewChild('summaryDetailModal', { static: false }) public summaryDetailModal: ModalDirective;
  @Output() emitEvent = new EventEmitter<any>();
  public filterDataModel: IfilterpreSalesleadsModel = <IfilterpreSalesleadsModel>{};
  public loggedInuserDetails: IloggedInuserDetails = <IloggedInuserDetails>{};
  public allPresalesLead: string[] = [];
  public isSpinnerActive: boolean = true;
  public preSales: string;
  public id: number;
  public enquiryRegModel: IenquiryRegModel = <IenquiryRegModel>{};
  public PreferredProjectInfo: string[] = [];
  public isMobileAvailable: boolean;
  public showmobile: string;
  public isEmailAvailable: boolean;
  public showemail: string;
  public leadName: string;
  public leadId: number;
  public SourceName: string;
  public DataNotFoundError: string;
  public showDataNotFoundError: boolean = true;
  public selectedDateRange: any;
  public StartDate: any;
  public EndDate: any;
  public enquiryStatus: string;
  public allEnquiryId: number[] = [];
  public selectedReportingto: string[] = [];
  public reportingNameId: number;
  public projectNameId: number;
  public LeadName: string;
  public countOnStatus: number;        //Used For Count of Enquiries on Status
  public multiReassign: boolean = false;
  public enquiryIdList: number[] = [];
  public selectedEmployeeName: string[];
  public reassignModel: IreassignModel = <IreassignModel>{};
  public selectedAll: boolean = false;
  public campaignInfo: string[] = [];
  public sourceInfo: string[] = [];
  public presalesInfoModel: IpresalesInfoModel = <IpresalesInfoModel>{};
  public disabled = true;
  public filterAllPresalesLead: string[] = [];
  public Count: number = 0;
  public TodaysDate: string = '';
  public SwitchSummeryTitle: string = 'New Enquiry Summary';
  public Showsummery: boolean = false;
  public getEnquirySummaryData = [];
  public isLoading: boolean = false;
  public ismodalLoading = false;
  public getEnquiryDetail = [];
  public TotalEnquiry: number[] = [];
  public SummaryName: string = "";
  public SummaryDetailModel: object = {};
  public tableheader: string = '';
  public NoSummaryData: boolean = false;
  public TotalEnquirySummary: number = 0;
  public ProjectId: number = null;
  public getEnquiryCountByReason = [];
  public Status: string;
  public LeadId: number;
  public ReceivedOn: number;
  public Followup: string;
  public q1: number = 1;
  public p1: number = 1;
  public p2: number = 1;
  public Sitevisit: string;
  public presales: string;
  public StoreAllPresalesLead: string[] = [];
  public showSuccessfullMessage: string = "";
  public showNotSuccessfullMessage: string = "";
  public StatusChangeReason: any;
  public ranges: any = {
    'Today': [moment(), moment()],
    'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
    'Last 7 Days': [moment().subtract(6, 'days'), moment()],
    'Last 30 Days': [moment().subtract(29, 'days'), moment()],
    'This Month': [moment().startOf('month'), moment()],
    'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
    'Last 6 Months': [moment().subtract(6, 'month'), moment()]
  };
  public coldStatusInfo: any = [
    { key: "Loan Issues", value: "Loan Issues" },
    { key: "Budget issues", value: "Budget issues" },
    { key: "Customer Postponed property buying", value: "Customer Postponed property buying" },
    { key: "Requirement for lower floors", value: "Requirement for lower floors" },
    { key: "Location issue", value: "Location issue" },
    { key: "Apartment size issue", value: "Apartment size issue" },
    { key: "Possession mismatch", value: "Possession mismatch" },
    { key: "Will visit as per Convenience", value: "Will visit as per Convenience" },
    { key: "Looking for smaller apartment", value: "Looking for smaller apartment" },
    { key: "Looking for Plot", value: "Looking for Plot" },
    { key: "Looking for larger apartment", value: "Looking for larger apartment" }];
  public unqualifiedStatusInfo: any = [
    { key: "No Followup", value: "No Followup" },
    { key: "Not Interested", value: "Not Interested" },
    { key: "Duplicate Customer", value: "Duplicate Customer" },
    { key: "Looking for Commercial", value: "Looking for Commercial" },
    { key: "Looking for Plot", value: "Looking for Plot" },
    { key: "Not looking property", value: "Not looking property" },
    { key: "Dropped the plan", value: "Dropped the plan" },
    { key: "Not answering / Responding", value: "Not answering / Responding" },
    { key: "Is a Channel Partner", value: "Is a Channel Partner" },
    { key: "Customer already booked property in past with us", value: "Customer already booked property in past with us" },
    { key: "Booked with competitor", value: "Booked with competitor" },
    { key: "Invalid Customer Contact Number", value: "Invalid Customer Contact Number" },
    { key: "False Enquiry", value: "False Enquiry" }];
  public warmStatusInfo: any = [
    { key: "Had long discussion on call", value: "Had long discussion on call" },
    { key: "Interested in Sitevisit", value: "Interested in Sitevisit" },
    { key: "Second Sitevisit", value: "Second Sitevisit" },
    { key: "Spend long time during Sitevisit", value: "Spend long time during Sitevisit" },
    { key: "Matches customer requirements", value: "Matches customer requirements" },
    { key: "Matches customer Preferred location", value: "Matches customer Preferred location" },
    { key: "Multiple incoming calls", value: "Multiple incoming calls" }];

  public form = new FormGroup({
    dateYMD: new FormControl(new Date()),
    dateFull: new FormControl(new Date()),
    dateMDY: new FormControl(new Date()),
    dateRange: new FormControl([new Date(), new Date()])
  });

  public dpConfig: Partial<BsDatepickerConfig> = new BsDatepickerConfig();

  public preferredCityInfo: any = [
    { key: "Pune", value: "Pune" },
    { key: "Mumbai", value: "Mumbai" },
    { key: "Nashik", value: "Nashik" }];
  public propertyTypeInfo: any = [
    { key: "Residential", value: "Residential" },
    { key: "Commercial", value: "Commercial" },
    { key: "IT Park", value: "IT Park" }];
  public BudgetInfo: any = [
    { key: "0 to 25", value: "0 to 25" },
    { key: "25 to 35", value: "25 to 35" },
    { key: "35 to 45", value: "35 to 45" },
    { key: "45 to 55", value: "45 to 55" },
    { key: "55 to 65", value: "55 to 65" },
    { key: "65 to 75", value: "65 to 75" },
    { key: "75 to 85", value: "75 to 85" },
    { key: "85 to 95", value: "85 to 95" },
    { key: "95 to More than 100", value: "95 to More than 100" }];
  public StatusInfo: any = [
    { key: "My Todays Calls", value: "My Todays Calls" },
    { key: "Todays FollowUp", value: "Todays FollowUp" },
    { key: "No Action Planned", value: "No Action Planned" },
    { key: "Re-engaged Leads", value: "Re-engaged Leads" },
    { key: "NRI Leads", value: "NRI Leads" },
    { key: "Incoming", value: "Incoming" },
    { key: "Prospect", value: "Prospect" },
    { key: "Warm", value: "Warm" },
    { key: "Hot", value: "Hot" },
    { key: "Cold", value: "Cold / Not Responding" },
    { key: "UnqualifiedLostByPresale", value: "Unqualified/Lost By Presales" },
    { key: "UnqualifiedLostBySales", value: "Unqualified/Lost By Sales" },
    { key: "All - (Unqualified/Lost)", value: "All Enquiry" }];
  public SummaryNameList: any = [
    { key: 'BySource', value: 'By Source' },
    { key: 'ByProject', value: 'By Project' },
    { key: 'ByPresales', value: 'By Presales' }];
  public filterStatus: any = [
    { key: "incoming", value: "Incoming" },
    { key: "prospect", value: "Prospect" },
    { key: "warm", value: "Warm" },
    { key: "hot", value: "Hot" },
    { key: "cold", value: "Cold" },
    { key: "unqualified", value: "Unqualified" },
    { key: "lost", value: "Lost" }];
  public ListOffilter = [
    { item: 'EnquiryId' },
    { item: 'Name' },
    { item: 'LastName' },
    { item: 'EnquiryStatus' },
    { item: 'Source' },
    { item: 'PresalesAgentAssigned' },
    { item: 'CreatedOn' },
    { item: 'PreferredDate' },
    { item: 'FollowUpStatus' },
    { item: 'Campaign' },
    { item: 'ReengagedOn' },
    { item: 'PreferredProject' }];
  public reassigntoEmployeeSubscription: Subscription;
  public selectedEmpListSubscription: Subscription;
  public sourceCampaignSubscription: Subscription;
  public selectedReportingTo: Subscription;
  public presalesLeadSubscription: Subscription;
  public projectListSubscription: Subscription;
  public mobileValidationSubscription: Subscription;
  public mobileValidationSubscriptions: Subscription;
  public emailValidationSubscription: Subscription;
  public submitClickSubscription: Subscription;
  public unqulifiedLostSubscription: Subscription;
  public getEnquirySummarySubscription: Subscription;
  public getEnquirySummaryDetailSubscription: Subscription;
  public showme: boolean = true;

  constructor(
    private preSalesLeadsService: PreSalesLeadsService,
    private excelService: ExcelService, private leadGenerationService: LeadGenerationService,
    private sharedService: SharedService, public router: Router,
    private encryptDecryptService: EncryptDecryptService, private snackBar: MatSnackBar) { }

  ngOnInit() {
    if (localStorage.getItem('LoggedinUser')) {
      this.loggedInuserDetails = JSON.parse(localStorage.getItem('LoggedinUser'));
      if (this.loggedInuserDetails) {
        this.enquiryRegModel.preCity = "";
        this.enquiryRegModel.PreferredProject = "";
        this.enquiryRegModel.Source = "";
        this.enquiryRegModel.PropertyType = "";
        this.enquiryRegModel.Budget = "";
        this.enquiryRegModel.Campaign = "";
        this.SummaryName = '';
        this.StatusChangeReason = '';
        this.enquiryRegModel.refCountryCode = 91;
        this.reassignModel.PresalesAgentAssigned = "";
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth() + 1; //January is 0!
        var yyyy = today.getFullYear();
        this.TodaysDate = (yyyy + '-' + (mm < 10 ? '0' + mm : mm) + '-' + (dd < 10 ? '0' + dd : dd));
        if (sessionStorage.presalesleads) {
          const Data = JSON.parse(sessionStorage.getItem('presalesleads'));
          let decryptedData = this.encryptDecryptService.decryptData(Data);
          this.filterAllPresalesLead = decryptedData[0]['filterAllPresalesLead'] ? decryptedData[0]['filterAllPresalesLead'] : [];
          this.allPresalesLead = decryptedData[0]['allPresalesLead'] ? decryptedData[0]['allPresalesLead'] : [];
          this.countOnStatus = decryptedData[0]['countOnStatus'] ? decryptedData[0]['countOnStatus'] : 1;
          this.p1 = decryptedData[0]['p1'] ? decryptedData[0]['p1'] : 1;
          this.enquiryStatus = decryptedData[0]['enquiryStatus'] ? decryptedData[0]['enquiryStatus'] : '';
          this.isSpinnerActive = this.showDataNotFoundError = this.allPresalesLead.length > 0 ? false : true;
          this.selectedEmployeeName = decryptedData[0]['selectedEmployeeName'] ? decryptedData[0]['selectedEmployeeName'] : null;
          this.selectedReportingto = decryptedData[0]['selectedReportingto'] ? decryptedData[0]['selectedReportingto'] : null;
          this.reportingNameId = decryptedData[0]['reportingNameId'] ? decryptedData[0]['reportingNameId'] : null;
          // this.multiReassign = (this.loggedInuserDetails.Role === 11 || this.loggedInuserDetails.Role === 1) ? true : false;
          this.disabled = decryptedData[0]['disabled'];
          this.Count = decryptedData[0]['Count'];
          this.SummaryNameList = decryptedData[0]['SummaryNameList'].length > 0 ? decryptedData[0]['SummaryNameList'] : [];
          this.SummaryName = decryptedData[0]['SummaryName'] ? decryptedData[0]['SummaryName'] : 'select';
          this.selectedDateRange = decryptedData[0]['selectedDateRange'] ? decryptedData[0]['selectedDateRange'] : null;
          this.PreferredProjectInfo = decryptedData[0]['PreferredProjectInfo'].length > 0 ? decryptedData[0]['PreferredProjectInfo'] : [];
          this.getEnquirySummaryData = decryptedData[0]['getEnquirySummaryData'].length > 0 ? decryptedData[0]['getEnquirySummaryData'] : [];
          this.isLoading = decryptedData[0]['isLoading'];
          this.getEnquiryDetail = decryptedData[0]['getEnquiryDetail'].length > 0 ? decryptedData[0]['getEnquiryDetail'] : [];
          this.getEnquiryCountByReason = decryptedData[0]['getEnquiryCountByReason'].length > 0 ? decryptedData[0]['getEnquiryCountByReason'] : [];
          this.StartDate = decryptedData[0]['startDate'] ? decryptedData[0]['startDate'] : null;
          this.EndDate = decryptedData[0]['EndDate'] ? decryptedData[0]['EndDate'] : null;
          this.allEnquiryId = decryptedData[0]['allEnquiryId'].length > 0 ? decryptedData[0]['allEnquiryId'] : [];
          this.presalesInfoModel.Status = decryptedData[0]['presalesInfoModelStatus'] ? decryptedData[0]['presalesInfoModelStatus'] : null;
          this.StatusChangeReason = decryptedData[0]['StatusChangeReason'] ? decryptedData[0]['StatusChangeReason'] : '';
          this.campaignInfo = decryptedData[0]['campaignInfo'].length > 0 ? decryptedData[0]['campaignInfo'] : [];
          // this.sourceInfo = decryptedData[0]['sourceInfo'].length > 0 ? decryptedData[0]['sourceInfo'] : [];
          this.isSpinnerActive = false;
          this.DataNotFoundError = this.allPresalesLead.length === 0 ? 'No Data found' : '';
          this.StoreAllPresalesLead = decryptedData[0]['StoreAllPresalesLead'].length > 0 ? decryptedData[0]['StoreAllPresalesLead'] : [];
        } else {
          this.GetSelectedReportingTo();
          this.enquiryStatus = 'My Todays Calls';
          this.GetProjectNameList();
          this.enquiryRegModel.preCity = "";
          this.enquiryRegModel.PreferredProject = "";
          this.enquiryRegModel.Source = "";
          this.enquiryRegModel.PropertyType = "";
          this.enquiryRegModel.Budget = "";
          this.enquiryRegModel.Campaign = "";
          this.SummaryName = '';
          this.getSelectedEmployeeNameList();
          this.reassignModel.PresalesAgentAssigned = "";
          this.getSourceCamapignList();
          var today = new Date();
          var dd = today.getDate();
          var mm = today.getMonth() + 1; //January is 0!
          var yyyy = today.getFullYear();
          this.TodaysDate = (yyyy + '-' + (mm < 10 ? '0' + mm : mm) + '-' + (dd < 10 ? '0' + dd : dd));
        }
        this.getSourceCamapignList();
      }
    } else {
      this.router.navigate(['/login']);
    }
    this.dpConfig.containerClass = 'theme-dark-blue';
  }
  getSourceCamapignList = () => {
    this.sourceCampaignSubscription = this.preSalesLeadsService.getSourceCampaign(this.loggedInuserDetails, null).subscribe((response) => {
      if (response && response["data"]) {
        this.campaignInfo = response["data"].filter(x => x.Type === 'Campaign');
        this.sourceInfo = response["data"].filter(x => x.Type === 'Source');
        this.setSesstion();
      }
    });
  }
  changeStatus = (leadId) => {
    //-------For tab Changes -------//
    this.preSales = leadId;
    this.id = this.preSales['EnquiryId'];
    this.emitEvent.emit({ id: this.id, enqId: this.allEnquiryId });
    this.sharedService.shareLeadDetails('tab14');
    //-------End-------//
  }
  GetSelectedReportingTo = () => {
    //--- get reporting employee name of current logging user---//
    this.selectedReportingTo = this.preSalesLeadsService.GetSelectedReporting(this.loggedInuserDetails).subscribe((response) => {
      if (response["data"] && response["data"]) {
        this.selectedReportingto = response["data"];
        this.reportingNameId = this.loggedInuserDetails.EntityId;
        this.StartDate = moment().format('YYYY-MM-DD');
        this.EndDate = moment().format('YYYY-MM-DD');
        this.getPresalesLead();
      }
    });
    //---end---//
  }
  pageChangeEvent(PageId) {
    this.p1 = PageId ? PageId : 1;
    this.setSesstion();
  }
  getPresalesLead = () => {
    //-------Get All presales lead-------//
    this.filterAllPresalesLead = [];
    this.allPresalesLead = [];
    this.presalesInfoModel.reportingNameId = this.reportingNameId;
    this.presalesInfoModel.ProjectId = this.projectNameId;
    this.presalesInfoModel.Status = this.enquiryStatus;
    if (this.presalesInfoModel.Status.toLowerCase() === "my todays calls" || this.presalesInfoModel.Status.toLowerCase() === "todays followUp") {
      this.StartDate = '';
      this.EndDate = '';
      this.selectedDateRange = <IselectedDateRange>{};
    }
    if (this.presalesInfoModel.Status === 'UnqualifiedLostBySales' || this.presalesInfoModel.Status === 'UnqualifiedLostByPresale') {
      this.showUnqualifiedOrLostEnquiry(this.StartDate, this.EndDate, this.presalesInfoModel.Status);
    } else {
      this.isSpinnerActive = true;
      this.presalesLeadSubscription = this.preSalesLeadsService.getAllPresalesLead(this.loggedInuserDetails, this.presalesInfoModel, this.StartDate, this.EndDate).subscribe((response) => {
        if (response && response["data"][0].length > 0) {
          this.allPresalesLead = response["data"][0];
          this.StoreAllPresalesLead = response["data"][0];
          this.countOnStatus = response["data"][0].length;
          this.showDataNotFoundError = false;
          this.allEnquiryId = [];
          this.allPresalesLead.forEach(element => {
            this.allEnquiryId.push(element['EnquiryId'])
          });
          this.filterAllPresalesLead = this.allPresalesLead;
          this.setSesstion();
        } else {
          this.DataNotFoundError = response['exception'];
          this.showDataNotFoundError = true;
          this.countOnStatus = 0;
          this.setSesstion();
        }
        this.isSpinnerActive = false;
      });
    }
    // this.onChangeDate(this.selectedDateRange);
    //-------End-------//
  }
  onChangeSubStatus = (subStatus) => {
    this.allEnquiryId = [];
    if (subStatus && subStatus !== '') {
      this.allPresalesLead = this.StoreAllPresalesLead.filter(x => x['StatusChangeReason'] ? x['StatusChangeReason'] === subStatus : []);
      this.allPresalesLead.map(e => {
        this.allEnquiryId.push(e['EnquiryId']);
      });
      this.countOnStatus = this.allPresalesLead.length > 0 ? this.allPresalesLead.length : 0;
      this.setSesstion();
    } else {
      this.allPresalesLead = this.StoreAllPresalesLead;
      this.countOnStatus = this.allPresalesLead.length > 0 ? this.allPresalesLead.length : 0;
      this.allPresalesLead.map(e => {
        if (e['EnquiryId']) {
          this.allEnquiryId.push(e['EnquiryId']);
        }
      });
      this.setSesstion();
    }
  }
  onChangeReporting = (reportValue) => {
    //---change employee Id and get result of Enquiry---//
    this.reportingNameId = reportValue;
    this.StartDate = this.StartDate ? this.StartDate : moment().format('YYYY-MM-DD');
    this.EndDate = this.EndDate ? this.EndDate : moment().format('YYYY-MM-DD');
    this.getPresalesLead();
    //---end---//
  }
  onChangeProject = (ProjectId) => {
    //---change employee Id and get result of Enquiry---//
    this.projectNameId = ProjectId;
    this.StartDate = this.StartDate ? this.StartDate : moment().format('YYYY-MM-DD');
    this.EndDate = this.EndDate ? this.EndDate : moment().format('YYYY-MM-DD');
    this.getPresalesLead();
    //---end---//
  }
  onChangeStatus = (statusValue) => {
    this.disabled = false;
    //---get enquiry if status change---//
    //this.selectedDateRange= this.localeService.use(statusValue);
    this.onChangeDate(this.selectedDateRange)

    //this.selectedDateRange ? this.selectedDateRange : "";
    this.enquiryStatus = statusValue;
    this.StartDate = this.enquiryStatus === 'Unqualified/Lost' ? moment().format('YYYY-MM-DD') : this.StartDate;
    this.EndDate = this.enquiryStatus === 'Unqualified/Lost' ? moment().format('YYYY-MM-DD') : this.EndDate;
    this.getPresalesLead();
    switch (statusValue) {
      case 'My Todays Calls':
      case 'Todays FollowUp':
        this.disabled = true;
        break;
    }
    //---end---//
  }
  setSesstion() {
    let Data = [];
    Data.push({
      filterAllPresalesLead: this.filterAllPresalesLead.length > 0 ? this.filterAllPresalesLead : [],
      allPresalesLead: this.allPresalesLead.length > 0 ? this.allPresalesLead : [],
      p1: this.p1 != 1 ? this.p1 : 1,
      enquiryStatus: this.enquiryStatus,
      showDataNotFoundError: this.showDataNotFoundError,
      isSpinnerActive: false,
      selectedEmployeeName: this.selectedEmployeeName && this.selectedEmployeeName.length > 0 ? this.selectedEmployeeName : [],
      selectedReportingto: this.selectedReportingto.length > 0 ? this.selectedReportingto : [],
      reportingNameId: this.reportingNameId,
      disabled: this.disabled,
      Count: this.Count,
      SummaryNameList: this.SummaryNameList.length > 0 ? this.SummaryNameList : [],
      SummaryName: this.SummaryName,
      PreferredProjectInfo: this.PreferredProjectInfo.length > 0 ? this.PreferredProjectInfo : [],
      getEnquirySummaryData: this.getEnquirySummaryData.length > 0 ? this.getEnquirySummaryData : [],
      isLoading: false,
      getEnquiryDetail: this.getEnquiryDetail.length > 0 ? this.getEnquiryDetail : [],
      getEnquiryCountByReason: this.getEnquiryCountByReason.length > 0 ? this.getEnquiryCountByReason : [],
      startDate: this.StartDate,
      EndDate: this.EndDate,
      countOnStatus: this.countOnStatus,
      presalesInfoModelStatus: this.presalesInfoModel.Status ? this.presalesInfoModel.Status : null,
      StatusChangeReason: this.StatusChangeReason ? this.StatusChangeReason : '',
      campaignInfo: this.campaignInfo.length > 0 ? this.campaignInfo : '',
      StoreAllPresalesLead: this.StoreAllPresalesLead.length > 0 ? this.StoreAllPresalesLead : [],
      allEnquiryId: this.allEnquiryId && this.allEnquiryId.length > 0 ? this.allEnquiryId : []
    });
    let encryptedData = this.encryptDecryptService.encryptData(Data);
    sessionStorage.setItem('presalesleads', JSON.stringify(encryptedData));
    this.NoSummaryData = this.getEnquirySummaryData.length > 0 ? false : true;
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
  //when country code is not 91//
  valid = (mobile) => {
    if (mobile)
      this.mobileValidationSubscriptions = this.leadGenerationService.getMobileValidation(mobile).subscribe((response) => {
        if (response && response["data"]) {
          this.isMobileAvailable = (response["data"][0].IsAvailable === 'Available');
          this.showmobile = response["data"][0].IsAvailable;
        }
      });
  }
  // when country code is not 91//
  show = (data) => {
    this.showme = data !== '91' ? false : true;
    this.enquiryRegModel.refMobileNo = null;
  }

  getMobileValidation = (mobile) => {
    //-------For Mobile No Validation-------//
    var mobilepattern: any = /^\d{10}$/;
    if (mobile && mobile.length == 10 && mobilepattern.test(mobile)) {
      this.mobileValidationSubscription = this.leadGenerationService.getMobileValidation(mobile).subscribe((response) => {
        if (response && response["data"]) {
          this.isMobileAvailable = (response["data"][0].IsAvailable === 'Available');
          this.showmobile = response["data"][0].IsAvailable;
        }
      });
    } else {
      this.showmobile = "";
    }
    //-------End-------//
  }
  getEmailValidation = (email) => {
    //-------For Email Validation-------//
    var emailpattern: any = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$/;
    if (email && emailpattern.test(String(email).toLowerCase())) {
      this.emailValidationSubscription = this.leadGenerationService.getEmailValidation(email).subscribe((response) => {
        if (response && response["data"]) {
          this.isEmailAvailable = (response["data"][0].IsAvailable === 'Available');
          this.showemail = response["data"][0].IsAvailable;
        }
      });
    } else {
      this.showemail = "";
    }
    //-------End-------//
  }
  OnSubmitBtnClick = (enquiryRegModel, enquiryRegistrationForm) => {
    //-------Enquiry Registration-------//
    this.submitClickSubscription = this.preSalesLeadsService.insertEnquiryRegistration(enquiryRegModel, this.loggedInuserDetails).subscribe((response) => {
      if (response && response['successful']) {
        this.showSuccessfullMessage = "Enquiry Generated Successfully.";
        this.getPresalesLead();
        this.showme = true;
      } else {
        this.showNotSuccessfullMessage = "Enquiry Generation Failed.";
      }
      setTimeout(() => {
        this.showSuccessfullMessage = this.showNotSuccessfullMessage = '';
        this.createPreSalesLead.hide();
      }, 3000);
      this.enquiryRegModel = <IenquiryRegModel>{};
      enquiryRegistrationForm.form.markAsPristine();
      enquiryRegistrationForm.form.markAsUntouched();
      this.clearTextMsg();
      this.enquiryRegModel.preCity = "";
      this.enquiryRegModel.PreferredProject = "";
      this.enquiryRegModel.Source = "";
      this.enquiryRegModel.PropertyType = "";
      this.enquiryRegModel.Budget = "";
    });
    //-------End-------//
  }
  showUnqualifiedOrLostEnquiry(StartDate, EndDate, status) {
    //-------Get All presales lead-------//
    this.isSpinnerActive = true;
    this.unqulifiedLostSubscription = this.preSalesLeadsService.getAllUnqualifiedOrLostPresalesLead(this.loggedInuserDetails, StartDate, EndDate, this.ProjectId, status).subscribe((response) => {
      if (response && response['successful'] && response['data'].length > 0) {
        this.allPresalesLead = response['data'];
        this.StoreAllPresalesLead = response["data"];
        this.countOnStatus = response['data'].length;
        this.showDataNotFoundError = false;
        this.allEnquiryId = [];
        this.allPresalesLead.forEach(element => {
          this.allEnquiryId.push(element['EnquiryId'])
        });
        this.filterAllPresalesLead = this.allPresalesLead;
        this.setSesstion();
        this.isSpinnerActive = false;
      } else {
        this.DataNotFoundError = "No Data Found";
        this.showDataNotFoundError = true;
        this.setSesstion();
        this.isSpinnerActive = false;
      }
    });
    //-------End-------//
  }

  onChangeDate = (selectedDateRange) => {
    if (selectedDateRange != undefined && selectedDateRange.startDate != null && selectedDateRange.endDate != null) {
      //-----when date range change-----//
      this.StartDate = selectedDateRange.startDate.format('YYYY-MM-DD');
      this.EndDate = selectedDateRange.endDate.format('YYYY-MM-DD');
      (this.Count === 0) ? this.getPresalesLead() : this.getEnquirySummary();
      //-----End-----//
    }
  }

  selectedMultipleIds = (checked: boolean, enquirydetails) => {
    // ------- For Multiple ids get checked -------//
    if (checked) {
      this.enquiryIdList.push(enquirydetails.EnquiryId);
    } else {
      let index = this.enquiryIdList.indexOf(enquirydetails.EnquiryId);
      if (index !== -1) {
        this.enquiryIdList.splice(index, 1);
      }
    }
    //-----End-----//
  }

  selectAllReassignIds = (checked: boolean) => {
    if (checked)
      this.allPresalesLead.forEach(element => {
        element['checked'] = true;
        this.selectedAll = true;
        this.enquiryIdList.push(element['EnquiryId']);
      });
    else {
      this.allPresalesLead.forEach(element => {
        element['checked'] = false;
        this.selectedAll = false;
        let index = this.enquiryIdList.indexOf(element['EnquiryId']);
        if (index !== -1) {
          this.enquiryIdList.splice(index, 1);
        }
      });
    }
  }

  getSelectedEmployeeNameList = () => {
    //************* Get All Presale Employee Name List **************//
    this.selectedEmpListSubscription = this.leadGenerationService.getAllSalesEmployeeOnSelected(this.loggedInuserDetails, 5).subscribe((response) => {
      if (response && response["data"]) {
        this.selectedEmployeeName = response["data"];
      }
    });
    //************* End **************//
  }

  reassigntoEmployee = (reassignModel) => {
    //************* Reassign enquiries to Selected Employee **************//
    reassignModel.enquiryIdList = this.enquiryIdList.join(",");
    reassignModel.Input = 'Enquiry';
    this.reassigntoEmployeeSubscription = this.preSalesLeadsService.multipleReassign(this.loggedInuserDetails, reassignModel).subscribe((response) => {
      if (response && response['successful']) {
        this.showSuccessBar("Enquiry Reassign Successfully.");
        this.getPresalesLead();
        this.enquiryIdList = [];
      } else {
        this.showFailedBar("Enquiry Reassign Failed.");
      }
    });
    //************* End **************//
  }
  filterLeadData = () => {
    let counter = 0;
    this.ListOffilter.forEach(element => {
      if (element && this.filterDataModel[element.item]) {
        let Dat = counter > 0 ? this.allPresalesLead : this.filterAllPresalesLead;
        this.allPresalesLead = Dat.filter(x => x[element.item] && x[element.item].toString().toLowerCase().indexOf(String(this.filterDataModel[element.item]).toLowerCase()) !== -1);
        counter++;
      }
    });
    this.allPresalesLead = counter === 0 ? this.filterAllPresalesLead : this.allPresalesLead;
  }

  switchToSummery() {
    //********* Switch beetween(show and hide between summary Analysis*********//    
    if (this.Count === 0) {
      this.Count = 1;
      this.showDataNotFoundError = true;
      this.disabled = false;
      this.ProjectId = null;
      this.SummaryName = 'select';
      this.Status = '';
      this.SwitchSummeryTitle = 'Hide Summary';
      this.Showsummery = true;
    } else {
      if (this.enquiryStatus === 'My Todays Calls') {
        this.selectedDateRange = null;
        this.disabled = true;
      } else {
        this.disabled = false;
      }
      this.showDataNotFoundError = false;
      this.getEnquirySummaryData = [];
      this.Count = 0;
      this.Showsummery = false;
      this.SwitchSummeryTitle = 'New Enquiry Summary';
    }

    //********* End *********//
  }

  //**************Get Suumary Detail by Source or Presale *****************//
  getSummaryDetail = (detail, status: string) => {
    this.ismodalLoading = true;
    this.SummaryDetailModel = [];
    this.Status = '';
    if (this.StartDate != undefined && this.StartDate != null && this.EndDate != null) {
      // this.SummaryDetailModel = this.selectedDateRange
      this.SummaryDetailModel['SummaryName'] = this.SummaryName;
      this.SummaryDetailModel['StartDate'] = this.StartDate;
      this.SummaryDetailModel['EndDate'] = this.EndDate;
      this.SummaryDetailModel['Value'] = (this.SummaryName === "BySource") ? detail.ColName : (detail.ColId ? detail.ColId : 0);
      this.SummaryDetailModel['Status'] = status;
      this.Status = status;
      this.getEnquirySummaryDetailSubscription = this.preSalesLeadsService.getEnquirySummaryDetail(this.loggedInuserDetails, this.SummaryDetailModel, this.ProjectId).subscribe((response) => {
        this.getEnquiryDetail = (response && response['data'][0] && response['data'][0].length > 0) ? response['data'][0] : [];
        this.getEnquiryCountByReason = (response && response['data'][1] && response['data'][1].length > 0) ? response['data'][1] : [];
        this.ismodalLoading = false;
        this.summaryDetailModal.show();
        this.setSesstion();
      });
    }
  }
  //************ Get Count and Total of Enquiry by Source and Presale *********//
  getEnquirySummary = () => {
    if (this.SummaryName != 'select') {
      if (this.selectedDateRange != undefined && this.selectedDateRange.startDate != null && this.selectedDateRange.endDate != null) {
        switch (this.SummaryName) {
          case 'BySource': this.tableheader = 'Source';
            break;
          case 'ByProject': this.tableheader = 'Project';
            this.ProjectId = null;
            break;
          case 'ByPresales': this.tableheader = 'Employee';
            break;
        }
        this.StartDate = this.selectedDateRange.startDate.format('YYYY-MM-DD');
        this.EndDate = this.selectedDateRange.endDate.format('YYYY-MM-DD');
        this.isLoading = true;
        this.getEnquirySummarySubscription = this.preSalesLeadsService.getEnquirySummary(this.loggedInuserDetails, this.StartDate, this.EndDate, this.SummaryName, this.ProjectId ? this.ProjectId : null).subscribe((response) => {
          this.getEnquirySummaryData = (response && response['data'][0] && response['data'][0].length > 0) ? response['data'][0] : [];
          this.TotalEnquirySummary = response['data'][1][0] ? response['data'][1][0]['TotalEnquiry'] : null;
          this.getEnquirySummaryData = (this.TotalEnquirySummary && this.TotalEnquirySummary !== 0) ? this.getTotalCount(this.getEnquirySummaryData) : [];
          this.NoSummaryData = this.getEnquirySummaryData.length > 0 ? false : true;
          this.isLoading = false;
          this.setSesstion();
        });
      }
    } else {
      this.getEnquirySummaryData = [];
    }
  }
  //******** Horizontally and Vertically Sum of All Data *******//
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

  exportPopEvent = () => {
    //---this export the Summary details in excel file---//
    if (this.getEnquiryDetail && this.getEnquiryDetail !== []) {
      this.excelService.exportAsExcelFile(this.getEnquiryDetail, 'ExcelSheet');
    }
    //---end---//
  }

  exportSummaryEvent = () => {
    //---this export the Summary Count details in excel file---//
    if (this.getEnquirySummaryData && this.getEnquirySummaryData !== []) {
      this.excelService.exportAsExcelFile(this.getEnquirySummaryData, 'ExcelSheet');
    }
    //---end---//
  }

  // ********* Get Total EnquiryId ************* //
  getTotalEnquiry = () => {
    this.getEnquiryDetail.map(element => {
      this.TotalEnquiry.push(element.EnquiryId);
    });
  }
  // ********* Shared Service to go to Enquiry Details ************* //
  showDetails = (details) => {
    this.getTotalEnquiry();
    details.id = details.EnquiryId;
    details.enqId = this.TotalEnquiry;
    const tab14 = `tab14`;
    details.tabNo = tab14;
    details.id ? this.sharedService.allLeadSearchDetails(details) : null;
  }
  openmodal() {
    //-------open modal on create button-------//
    this.enquiryRegModel.refCountryCode = null;
    this.createPreSalesLead.show();
    //-------End-------//
  }
  clearTextMsg() {
    this.showmobile = "";
    this.showemail = "";
  }
  onClose(enquiryRegistrationForm) {
    //-------close modal on cross button-------//
    this.createPreSalesLead.hide();
    this.enquiryRegModel = <IenquiryRegModel>{};
    enquiryRegistrationForm.form.markAsPristine();
    enquiryRegistrationForm.form.markAsUntouched();
    this.clearTextMsg();// clear message
    //-------End-------//
  }
  @HostListener('document:keyup', ['$event']) handleKeyUp(event) {
    if (event.keyCode === 27) {
      this.summaryDetailModal.hide();
      this.createPreSalesLead.hide();
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

  ngOnDestroy() {
    this.reassigntoEmployeeSubscription ? this.reassigntoEmployeeSubscription.unsubscribe() : null;
    this.selectedEmpListSubscription ? this.selectedEmpListSubscription.unsubscribe() : null;
    this.sourceCampaignSubscription ? this.sourceCampaignSubscription.unsubscribe() : null;
    this.selectedReportingTo ? this.selectedReportingTo.unsubscribe() : null;
    this.presalesLeadSubscription ? this.presalesLeadSubscription.unsubscribe() : null;
    this.projectListSubscription ? this.projectListSubscription.unsubscribe() : null;
    this.mobileValidationSubscription ? this.mobileValidationSubscription.unsubscribe() : null;
    this.mobileValidationSubscriptions ? this.mobileValidationSubscriptions.unsubscribe() : null;
    this.emailValidationSubscription ? this.emailValidationSubscription.unsubscribe() : null;
    this.submitClickSubscription ? this.submitClickSubscription.unsubscribe() : null;
    this.unqulifiedLostSubscription ? this.unqulifiedLostSubscription.unsubscribe() : null;
    this.getEnquirySummarySubscription ? this.getEnquirySummarySubscription.unsubscribe() : null;
    this.getEnquirySummaryDetailSubscription ? this.getEnquirySummaryDetailSubscription.unsubscribe() : null;
  }
}
export class TitleCasePipe implements PipeTransform {
  transform(input: string): string {
    return input.length === 0 ? '' :
      input.replace(/\w\S*/g, (txt => txt[0].toUpperCase() + txt.substr(1).toLowerCase()));
  }
}