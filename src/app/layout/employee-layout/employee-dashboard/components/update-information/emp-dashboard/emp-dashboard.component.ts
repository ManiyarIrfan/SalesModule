import { Component, OnInit, Output, EventEmitter, Inject, ViewChild, HostListener } from '@angular/core';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { EmpAnalyticsService } from 'src/app/shared/services/employee/emp-analytics.service';
import { ModalDirective } from 'ngx-bootstrap/modal/ngx-bootstrap-modal';
import { IfilterDataModelDashboard } from 'src/app/shared/models/employeeModel/employeeAnalytics.model';
import { SharedService } from 'src/app/shared/services/shared/shared.service';
import { OrderService } from 'src/app/shared/services/employee/order.service';
import { IloggedInuserDetails } from 'src/app/shared/models/Authentication/loggedInuserDetails.model';
import { Subscription } from 'rxjs';
import { IratioModel } from 'src/app/shared/models/employeeModel/employeeAnalytics.model';

const tab7 = `tab7`;
@Component({
  selector: 'tru-emp-dashboard',
  templateUrl: './emp-dashboard.component.html',
  styleUrls: ['./emp-dashboard.component.scss']
})
export class EmpDashboardComponent implements OnInit {
  @Output() emitEvent = new EventEmitter<any>();
  @Output() emitEventoppo = new EventEmitter<any>();
  @ViewChild('showcrmReportModal', { static: false }) public showcrmReportModal: ModalDirective;
  @Output() emitEventorder = new EventEmitter<any>();
  public new: boolean = false;
  selected: { startDate: moment.Moment, endDate: moment.Moment };
  public selectedProjectName: string[] = [];
  public refToSiteVisitRatio: string[] = [];
  public loggedInuserDetails: IloggedInuserDetails = <IloggedInuserDetails>{};
  public siteToOrderRatio: string[] = [];
  public ratioModel: IratioModel = <IratioModel>{};
  public spendRatio: string[] = [];
  public showtoManager: boolean = false;
  public id: number;
  public ranges: any = {
    'Today': [moment(), moment()],
    'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
    'Last 7 Days': [moment().subtract(6, 'days'), moment()],
    'Last 30 Days': [moment().subtract(29, 'days'), moment()],
    'This Month': [moment().startOf('month'), moment()],
    'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
    'Last 6 Months': [moment().subtract(6, 'month'), moment()]
  };
  public StartD: any;
  public EndD: any;
  selectedDateRange: { startDate: moment.Moment, endDate: moment.Moment };
  public PaymentDue: number;
  public totalOrders: number;
  public AgreementPending: number;
  public AgreementDone: number;
  public PaymentReceipt: number;
  public Modal_Title: string;
  public crmData: string[] = [];
  public isLoading: boolean = false;
  public q: number = 1;
  public errormessage:string;
  public filterDataModel: IfilterDataModelDashboard = <IfilterDataModelDashboard>{};
  public ListOffilter = [
    { item: 'OrderId' },
    { item: 'BookingDate' },
    { item: 'LeadName' },
    { item: 'MobileNo' },
    { item: 'OrderStatus' },
    { item: 'AgreementDate' },
    { item: 'SalesAgentId' }
  ];
  public storeData: string[] = [];
  public allOrderDetails: string[] = [];

  private _EventSubscription: Array<Subscription> = [];

  constructor(
    private empAnalyticService: EmpAnalyticsService,
    private router: Router,
    private sharedService: SharedService,
    private orderService: OrderService,) { }
  ngOnInit() {
    this.loggedInuserDetails = JSON.parse(localStorage.getItem('LoggedinUser'));
    if (this.loggedInuserDetails) {

      this.GetSelectedProjectsList();
      this.selectedDateRange = { startDate: moment().subtract(30, 'days'), endDate: moment() };
      this.changeDateCRM(this.selectedDateRange);
      this.showtoManager = this.loggedInuserDetails.Role === 9 || this.loggedInuserDetails.Role === 11 || this.loggedInuserDetails.Role === 2 ? true : false;
    } else {
      this.router.navigate(['/login']);
    }
  }
  onButtonClick = (selected, ratioModel) => {
    if(selected.endDate === null && selected.startDate === null)
    {
      this.errormessage = 'Please select date range.';
    }
    else
    {
      this.errormessage = '';
      this.getAllRatio(selected, ratioModel);
       this.new = true;
       setTimeout(() => {
       this.new = false;
    }, 5000);
    }
  }
  getAllRatio = (selected, ratioModel) => {
    //-------to Get all Ratio-------//
    if (ratioModel.searchProjectName === undefined || ratioModel.totalSpend === undefined) {
      ratioModel.searchProjectName = "";
      ratioModel.totalSpend = "";
    }
    const getRatioSub = this.empAnalyticService.getRatio(this.loggedInuserDetails, selected, ratioModel.searchProjectName, ratioModel.totalSpend).subscribe((response) => {
      if (response && response['data'][0]) {
        this.refToSiteVisitRatio = response['data'][0][0].SiteVisitOnProject;
        this.siteToOrderRatio = response['data'][1][0].ReferralSiteVisitToOrderOnProject;
        this.spendRatio = response['data'][2][0].ReferralToSpendsOnProject;
      }
    });
    this._EventSubscription.push(getRatioSub);
    //-------End-------//
  }
  changeDateCRM = (selectedDateRange) => {
    if (selectedDateRange !== undefined && selectedDateRange.startDate !== null && selectedDateRange.endDate !== null) {
      this.StartD = selectedDateRange.startDate;
      this.EndD = selectedDateRange.endDate;
      this.StartD = this.StartD.format('YYYY-MM-DD');
      this.EndD = this.EndD.format('YYYY-MM-DD');
      this.get_CrmCount(this.StartD, this.EndD);
    }
  }
  get_CrmCount = (startDate, endDate) => {
    const get_CrmCountSub = this.empAnalyticService.getCrmDashboardDetails(this.loggedInuserDetails, startDate, endDate).subscribe((response) => {
      if (response && response['data']) {
        this.totalOrders = response['data'][0][0].TotalOrders;
        this.PaymentDue = response['data'][1][0].PaymentDue;
        this.PaymentReceipt = response['data'][2][0].PaymentReceipt;
        this.AgreementPending = response['data'][3][0].AgreementPending;
        this.AgreementDone = response['data'][4][0].AgreementDone;
      }
    });
    this._EventSubscription.push(get_CrmCountSub);
  }
  Show_Modal = (status) => {
    switch (status) {
      case 'OrderCount': this.Modal_Title = "Total Orders Details"; break;
      case 'PaymentDue': this.Modal_Title = "Payment Due Details"; break;
      case 'PaymentReceipt': this.Modal_Title = "Payment Receipt Details"; break;
      case 'AgreementPending': this.Modal_Title = "Agreement Pending Details"; break;
      case 'AgreementDone': this.Modal_Title = "AgreementDone Details"; break;
    }
    this.isLoading = true;
    this.showcrmReportModal.show();
    const getCrmPopupDetailsSub = this.empAnalyticService.getCrmPopupDetails(this.loggedInuserDetails, this.StartD, this.EndD, status)
      .subscribe((response) => {
        if (response && response['data'] && response['data'][0].length > 0) {
          this.crmData = response['data'][0];
          this.storeData = response['data'][0];
        } else {
          this.crmData = [];
        }
        this.isLoading = false;

      });
    this._EventSubscription.push(getCrmPopupDetailsSub);
  }
  //-------Tab switch to Tab no:-7 for Order-------//
  goToOrderTab = (data) => {
    data.redirectTo = true;
    this.emitEventorder.emit(data);
    this.sharedService.shareLeadDetails(tab7);
    //-------End-------//
  }
  //************* filter table popup data **************//
  filterLeadData = () => {
    let counter = 0;
    this.ListOffilter.map(element => {
      if (element && this.filterDataModel[element.item]) {
        let Data = counter > 0 ? this.crmData : this.storeData;
        this.crmData = Data.filter(x => x[element.item] && x[element.item].toString().toLowerCase().indexOf(String(this.filterDataModel[element.item]).toLowerCase()) !== -1);
        counter++;
      }
    });
    this.crmData = counter === 0 ? this.storeData : this.crmData;
  }
  GetSelectedProjectsList = () => {
    //-------Get All Project Names-------//
    const GetProjectListSub = this.empAnalyticService.GetProjectList(this.loggedInuserDetails).subscribe((response) => {
      if (response["data"])
        this.selectedProjectName = response["data"];
    });
    this._EventSubscription.push(GetProjectListSub);
    //-------End-------//
  }
  // **** send Id to Enquiry Details Components **** //
  receiveMessage($event) {
    this.id = $event
    this.emitEvent.emit({ id: this.id });
  }
  // **** send Id to Opportunity Details Components **** //
  receiveLeadMessage($event) {
    this.id = $event
    this.emitEventoppo.emit(this.id);
  }
  SelectAmountSpend(ProjectName, CampaignPlanModel, selected) {    //** get Detail by id **//    
    if (CampaignPlanModel.searchProjectName) {
      let SearchCampaignPlanModel = {};
      SearchCampaignPlanModel['Input'] = 'SelectKPI';
      SearchCampaignPlanModel['PlanId'] = CampaignPlanModel.PlanId ? CampaignPlanModel.PlanId : null;
      SearchCampaignPlanModel['PlanName'] = CampaignPlanModel.searchProjectName ? CampaignPlanModel.searchProjectName : null;
      SearchCampaignPlanModel['StartDate'] = selected.startDate.format('YYYY-MM-DD') ? selected.startDate.format('YYYY-MM-DD') : null;
      SearchCampaignPlanModel['EndDate'] = selected.endDate.format('YYYY-MM-DD') ? selected.endDate.format('YYYY-MM-DD') : null;
      let SubscriptionGetCampaignPlan = this.empAnalyticService.getCampaignPlan(this.loggedInuserDetails, SearchCampaignPlanModel).subscribe((response) => {
        if (response && response['data'] && response['exception'] === null) {
          this.ratioModel.totalSpend = Math.round(response['data'][0][0] && response['data'][0][0].TotalSpent ? response['data'][0][0].TotalSpent : 0);
        }
        this._EventSubscription.push(SubscriptionGetCampaignPlan);
      });
    }
  }

  @HostListener('document:keyup', ['$event']) handleKeyUp(event) {
    if (event.keyCode === 27) {
      this.showcrmReportModal.hide();
    }
  }
  trackByFn(item) {
    return item.id; // or item.id
  }
  //** action for ng On Destroy  **/
  ngOnDestroy() {
    for (let item of this._EventSubscription) {
      item.unsubscribe();
    }
  }
}
