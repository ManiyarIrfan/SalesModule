import { Component, OnInit, Output, EventEmitter, ViewChild, Input, OnDestroy } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { Subscription } from 'rxjs';
import { CroAdminDashboardService } from 'src/app/shared/services/employee/cro-admin-dashboard.service';
import { SharedService } from 'src/app/shared/services/shared/shared.service';
import { IloggedInuserDetails } from 'src/app/shared/models/Authentication/loggedInuserDetails.model';
import { MatSnackBar } from '@angular/material';
import { IrefModel } from 'src/app/shared/models/employeeModel/cro-admin-dashboard.model';

@Component({
  selector: 'tru-cro-admin-dashboard',
  templateUrl: './cro-admin-dashboard.component.html',
  styleUrls: ['./cro-admin-dashboard.component.scss']
})

export class CroAdminDashboardComponent implements OnInit, OnDestroy {
  public isSpinnerActive: boolean = false;
  public CroData = [];
  public CroLeadsData = [];
  public loggedInuserDetails: IloggedInuserDetails = <IloggedInuserDetails>{};
  public orgshowDataNotFoundError: string;
  public isSpinnerForTableActive: boolean = false;
  public CRODetails: string[] = [];
  public croName: string;
  public p1: number;
  public p2: number;
  public Tab19: string = "tab19";
  public DataNotFoundError: string;
  public tabActivate: string;
  public refModel: IrefModel = <IrefModel>{};
  public PreferredAreaInfo: string[] = [];
  public enableSource: boolean = false;
  public employeeName: string[] = [];
  public isshow: boolean;
  public isEmailAvailable: boolean;
  public showemail: string;
  public Role: number = 3;
  public selectedTime: string;
  public PreferredProjectInfo: string[] = [];
  public OldSalesAgentAssignedId: number;
  public OldStatus: string;
  public UpdateBtnEnbl: boolean = false;
  public SalesAgentName: string;
  public CROId: number;
  public CroDashBoardData: string[] = [];
  public TotalSiteVisit: number;
  public TotalCRO: number;
  public TotalBookings: number;
  public TotalLeads: number;
  public allCpCroId: string[] = [];
  public showLeadDetailSubscription: Subscription;
  public getInteractionSubscription: Subscription;
  public getupdateReferralSubscription: Subscription;
  public getlistOfLeadSubscription: Subscription;
  public getcroLeadSubscription: Subscription;
  public getAllSalesEmployeeSubscription: Subscription;
  public StatusInfo: any = [
    { key: "New", value: "New" },
    { key: "Contact Establish", value: "Contact Establish" },
    { key: "Site Visit Scheduled", value: "Site Visit Scheduled" },
    { key: "Site Visit Done", value: "Site Visit Done" },
    { key: "Negotiation", value: "Negotiation" },
    { key: "Booked", value: "Booked" },
    { key: "Unqualified", value: "Unqualified" },
    { key: "Booking Amount Paid", value: "Booking Amount Paid" },
    { key: "Loan Document Collected", value: "Loan Document Collected" },
    { key: "Lead Did Not Answer Call", value: "Lead Did Not Answer Call" },
    { key: "Assigned to Presales", value: "Assigned to Presales" },
    { key: "Lost", value: "Lost" }];

  @Output() emitEvent = new EventEmitter<any>();
  @Input() details: any = [];
  @ViewChild('leadDetailsModel', { static: false }) public leadDetailsModel: ModalDirective;

  constructor(
    private croAdminDashboardService: CroAdminDashboardService,
    private sharedService: SharedService, private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.isSpinnerActive = true;
    if (localStorage.getItem('LoggedinUser')) {
      this.loggedInuserDetails = JSON.parse(localStorage.getItem('LoggedinUser'));
      this.getCroLeadData();
      this.GetAllSalesEmployeeName();
    }
  }
  GetAllSalesEmployeeName() {
    //-------Get All Employee Name In Sales Agent Assign-------//
    this.getAllSalesEmployeeSubscription = this.croAdminDashboardService.getAllSalesEmployeeOnSelected(this.loggedInuserDetails, this.Role).subscribe((response) => {
      if (response && response["data"]) {
        this.employeeName = response["data"];
      }
    });
  }

  //-------Get All Leads By CRO's-------//
  getCroLeadData() {
    this.getcroLeadSubscription = this.croAdminDashboardService.getCROLeadsDataReport(this.loggedInuserDetails).subscribe((response) => {
      if (response && response["data"][0]) {
        this.CroData = response["data"][0];
        this.TotalSiteVisit = response["data"][1][0]['TotalSiteVisit'];
        this.TotalBookings = response["data"][2][0]['TotalBookings'];
        this.TotalCRO = response["data"][3][0]['TotalCRO'];
        this.TotalLeads = response["data"][4][0]['TotalLeads'];
        this.CroData.forEach(element => {
          this.allCpCroId.push(element.CroId)
        });
      } else {
        this.orgshowDataNotFoundError = 'Data Not Found';
      }
      this.isSpinnerActive = false;
    });
  }

  //-------Get All Leads By CRO's ID-------//
  getListOfLeads(CROId) {
    this.isSpinnerForTableActive = true;
    this.UpdateBtnEnbl = false;
    this.CROId = parseInt(CROId);
    this.getlistOfLeadSubscription = this.croAdminDashboardService.GetCROLeadsByCROId(this.loggedInuserDetails, this.CROId).subscribe((response) => {
      if (response && response["data"]) {
        this.CroLeadsData = response["data"];
      } else {
        this.orgshowDataNotFoundError = 'Data Not Found';
      }
      this.isSpinnerForTableActive = false;
      this.leadDetailsModel.hide();
    });
  }

  //-------Update Lead Stsuts and Sales Agent By Lead ID-------//
  OnSubmitBtnClick = (refModel) => {
    if (this.OldStatus !== refModel.ReferralStatus) {
      refModel.details = 'Referral Status Changed from ' + this.OldStatus + ' to ' + refModel.ReferralStatus + '.'
      refModel.ReferralStatus = this.OldStatus + '#**#' + refModel.ReferralStatus;
      refModel.InteractionType = 'Status Change';
      this.createInteraction(refModel);
    }
    if (this.OldSalesAgentAssignedId !== refModel.SalesAgentAssignedId) {
      let NewSalesName = this.employeeName.find(x => x['EmployeeId'] === parseInt(refModel.SalesAgentAssignedId));
      let oldSalesName = this.employeeName.find(x => x['EmployeeId'] === this.OldSalesAgentAssignedId);
      refModel.details = (oldSalesName) ? 'Sales Agent changed from ' + oldSalesName['Name'] + ' to ' + NewSalesName['Name'] : 'Sales Agent Assigned ' + NewSalesName['Name'];
      refModel.InteractionType = 'Sales Employee Change';
      this.createInteraction(refModel);
    }
    this.getupdateReferralSubscription = this.croAdminDashboardService.UpdateReferralStatus(refModel, this.loggedInuserDetails).subscribe((response) => {
      if (response && response['successful']) {
      }
    });
  }

  //-------Insert interaction-------//
  createInteraction = (refModel) => {
    this.getInteractionSubscription = this.croAdminDashboardService.UpdateLeadSalesPerson(refModel, this.loggedInuserDetails).subscribe((response) => {
      if (response && response['successful']) {
        this.showSuccessBar("Lead Update Successfully");
      } else {
        this.showFailedBar("Lead Update Failed");
      }
      this.getListOfLeads(this.CROId);
    });
  }

  //-------Get CRO's Info. for CRO interaction-------//
  showDashboard = (details) => {
    details.EntityId = details.CroId;
    details.UserType = 'CRO';
    this.CroData = details;
    this.emitEvent.emit({ id: this.CroData, allCpCroId: this.allCpCroId });
    this.sharedService.shareLeadDetails("tab19");
  }

  //-------Show Lead info. in model-------//
  ShowLeadDetails(LeadModel) {
    this.UpdateBtnEnbl = false;
    LeadModel.UserType = 'Referral';
    this.showLeadDetailSubscription = this.croAdminDashboardService.GetReferralByReferralId(this.loggedInuserDetails, LeadModel).subscribe((response) => {
      if (response && response["data"] && response["data"][0]) {
        this.refModel = response["data"][0];
        this.OldSalesAgentAssignedId = response["data"][0].SalesAgentAssignedId;
        this.OldStatus = response["data"][0].ReferralStatus;
        this.leadDetailsModel.show();
      }
    });
  }

  //-------Check Leads Sales Agent Assigned Id-------//
  OnSalesChange(SalesAgentAssignedId) {
    this.UpdateBtnEnbl = (this.OldSalesAgentAssignedId === parseInt(SalesAgentAssignedId) || SalesAgentAssignedId === "0") ? false : true;
  }

  //-------Check Leads Status-------//
  OnStatusChange(Status) {
    this.UpdateBtnEnbl = this.OldStatus === Status ? false : true;
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
    this.showLeadDetailSubscription ? this.showLeadDetailSubscription.unsubscribe() : null;
    this.getInteractionSubscription ? this.getInteractionSubscription.unsubscribe() : null;
    this.getupdateReferralSubscription ? this.getupdateReferralSubscription.unsubscribe() : null;
    this.getlistOfLeadSubscription ? this.getlistOfLeadSubscription.unsubscribe() : null;
    this.getcroLeadSubscription ? this.getcroLeadSubscription.unsubscribe() : null;
    this.getAllSalesEmployeeSubscription ? this.getAllSalesEmployeeSubscription.unsubscribe() : null;
  }
}