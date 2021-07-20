import { Component, OnInit, Input, SimpleChanges, EventEmitter, Output, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { IloggedInuserDetails } from 'src/app/shared/models/Authentication/loggedInuserDetails.model';
import { SalesLeadDetailsService } from 'src/app/shared/services/employee/sales-lead-details.service';
import { SharedService } from 'src/app/shared/services/shared/shared.service';
import { IleadinfoDetails, IinteractionModel, IsiteVisitModel } from 'src/app/shared/models/employeeModel/referal-status.model';
import { MatSnackBar } from '@angular/material';

const SiteVisitStatus = "Site Visit Scheduled";

@Component({
  selector: 'tru-leaddetails-popup',
  templateUrl: './leaddetails-popup.component.html',
  styleUrls: ['./leaddetails-popup.component.scss']
})

export class LeaddetailsPopupComponent implements OnInit, OnDestroy {
  public isShowProjectName: boolean = false;
  public To: number;
  public interactionForm: string;
  public CC: string;
  public loggedInuserDetails: IloggedInuserDetails = <IloggedInuserDetails>{};
  public leadinfoDetails: IleadinfoDetails = <IleadinfoDetails>{};
  public interactionModel: IinteractionModel = <IinteractionModel>{};
  public showSuccessfullMessage: string = "";
  public showNotSuccessfullMessage: string = "";
  public LeadshowSuccessfullMessage: string = "";
  public LeadshowNotSuccessfullMessage: string = "";
  public InteractionshowSuccessfullMessage: string = "";
  public InteractionshowNotSuccessfullMessage: string = "";
  public SiteshowSuccessfullMessage: string = "";
  public SiteshowNotSuccessfullMessage: string = "";

  public empName: string;
  public messageTemplate: string;
  public allProjectNames: string[] = [];
  public siteVisitModel: IsiteVisitModel = <IsiteVisitModel>{};
  public id: number;
  public from: number;
  public disableAllFields: boolean = false;
  public statusDetails: string;
  public ProjectName: string;
  public alternateNo: string[] = [];
  public disableCallBtn: boolean = false;
  public dsbSalesAgent: boolean = true;
  public salesEmployeesName: string[] = [];
  public selectedPreSalesEmployeeName: any = [];
  public SalesAgentAssingedid: string;
  public currentsales: string;
  public leadFollowUPTime: Date;
  public disableFollowUp: boolean = false;
  public gotoOrderBtn: boolean = false;
  public StatusInfo: any = [
    { key: "New", value: "New" },
    { key: "Warm", value: "Warm" },
    { key: "Hot", value: "Hot" },
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
  public lostStatusInfo: any = [
    { key: "Booked with competitor", value: "Booked with competitor" },
    { key: "Invalid Customer Contact Number", value: "Invalid Customer Contact Number" },
    { key: "False Enquiry", value: "False Enquiry" },
    { key: "Not interested", value: "Not interested" }];
  public unqualifiedStatusInfo: any = [
    { key: "No Followup", value: "No Followup" },
    { key: "Not Interested", value: "Not Interested" },
    { key: "Duplicate Customer", value: "Duplicate Customer" },
    { key: "Looking for Commercial", value: "Looking for Commercial" },
    { key: "Not answering / Responding", value: "Not answering / Responding" },
    { key: "Dropped the plan", value: "Dropped the plan" },
    { key: "Is a Channel Partner", value: "Is a Channel Partner" },
    { key: "Customer already booked property in past with us", value: "Customer already booked property in past with us" }];

  public warmStatusInfo: any = [
    { key: "Had long discussion on call", value: "Had long discussion on call" },
    { key: "Interested in Sitevisit", value: "Interested in Sitevisit" },
    { key: "Second Sitevisit", value: "Second Sitevisit" },
    { key: "Spend long time during Sitevisit", value: "Spend long time during Sitevisit" },
    { key: "Matches customer requirements", value: "Matches customer requirements" },
    { key: "Matches customer Preferred location", value: "Matches customer Preferred location" },
    { key: "Multiple incoming calls", value: "Multiple incoming calls" }];

  public coldStatusInfo: any = [
    { key: "Loan Issues", value: "Loan Issues" },
    { key: "Budget issues", value: "Budget issues" },
    { key: "Customer Postponed property buying", value: "Customer Postponed property buying" },
    { key: "Requirement for lower floors", value: "Requirement for lower floors" },
    { key: "Location issue", value: "Location issue" },
    { key: "Apartment size issue", value: "Apartment size issue" },
    { key: "Possession mismatch", value: "Possession mismatch" },
    { key: "Looking for smaller apartment", value: "Looking for smaller apartment" },
    { key: "Looking for Plot", value: "Looking for Plot" },
    { key: "Looking for larger apartment", value: "Looking for larger apartment" }];

  public preSalesEmpNameSubscribtion: Subscription;
  public allSalesEmployeeSubscribtion: Subscription;
  public updateLeadDetailsWithSiteVisitSubscription: Subscription;
  public GetSelectedProjectSubscription: Subscription;
  public insertInteractionStatusSubscription: Subscription;
  public updateFollowUpStatusSubscription: Subscription;
  public createSiteVisitSubscription: Subscription;

  @Input() leadDetails: any;
  @Output() emitClickLeadDetails = new EventEmitter<any>();

  constructor(
    private salesLeadDetailsService: SalesLeadDetailsService,
    private sharedService: SharedService,
    public router: Router,
    private messageService: MessageService, private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.loggedInuserDetails = JSON.parse(localStorage.getItem('LoggedinUser'));
    this.CC = this.loggedInuserDetails.UserEmail;
    this.empName = this.loggedInuserDetails.Firstname + " " + this.loggedInuserDetails.LastName;
    this.getProjectName();
    this.ProjectName = "";
    this.siteVisitModel.PreferredProject = "";
    this.messageTemplate = "";
    this.leadinfoDetails.followUp = "";
    this.from = this.loggedInuserDetails.MobileNo;
  }
  ngOnChanges(changes: SimpleChanges) {
    //-------For Enquiry Details Changes-------//
    if (changes.leadDetails && this.leadDetails) {
      if (localStorage.getItem('LoggedinUser')) {
        this.loggedInuserDetails = JSON.parse(localStorage.getItem('LoggedinUser'));
        this.getReferralDetails();
        this.getAllSalesEmployeeName();
        this.getAllPresalesEmployeeName();
      }
    } else {
      this.disableAllFields = true;
    }
    if (changes.isShowProjectName && this.isShowProjectName) {
      this.isShowProjectName = this.isShowProjectName;
    }
  }

  getReferralDetails = () => {
    this.id = this.leadDetails.ReferralId;
    this.To = this.leadDetails.MobileNo;
    this.leadinfoDetails = this.leadDetails;
    this.leadinfoDetails.Source = this.leadDetails.Source;
    this.leadinfoDetails.SalesAgentAssignedId = this.leadDetails.SalesAgentAssignedId;
    this.SalesAgentAssingedid = this.leadDetails.SalesAgentAssignedId;
    this.leadinfoDetails.name = this.leadDetails.SalesAgentAssinged;
    this.leadinfoDetails.ProjectVisited = this.leadDetails.PreferredProject;
    this.leadinfoDetails.FollowUpDate = this.leadDetails.FollowUpDate;
    this.leadinfoDetails.FollowUp = this.leadDetails.FollowUp;
    this.leadinfoDetails.FollowUpStatus = this.leadDetails.FollowUpStatus;
    this.leadinfoDetails.Agenda = this.leadDetails.FollowUpDetails;
    this.leadinfoDetails.FollowUpType = this.leadDetails.FollowUpType;
    this.leadinfoDetails.AlternateNo = this.leadDetails.AlternateNo;
    this.StatusInfo;
    this.leadinfoDetails.ReferralStatus = this.leadDetails.ReferralStatus;
    this.interactionModel.followUp = "";
    this.leadinfoDetails.followUpType = "";
    this.disableAllFields = (this.loggedInuserDetails['EntityId'] === this.leadDetails.SalesAgentAssignedId || this.loggedInuserDetails.Role === 1) ? false : true;
    this.getAlternateNo();
    if (this.leadinfoDetails.FollowUpDate === null || this.leadinfoDetails.FollowUpStatus === 'Canceled') {
      this.disableFollowUp = false;
      this.leadinfoDetails.FollowUpStatus = ''
      this.leadinfoDetails.Agenda = '';
    } else {
      this.disableFollowUp = true;
    }
  }

  getAllSalesEmployeeName = () => {
    //-------Get All Employee Name In Sales Agent Assign-------//
    this.allSalesEmployeeSubscribtion = this.salesLeadDetailsService.getAllSalesEmployeeOnSelected(this.loggedInuserDetails, 3).subscribe((response) => {
      if (response && response["data"]) {
        this.salesEmployeesName = response["data"];
      }
    });
  }

  getAllPresalesEmployeeName() {
    //-------Get All Employee Name of pre-Sales Agent Assign-------//
    this.preSalesEmpNameSubscribtion = this.salesLeadDetailsService.getAllSalesEmployeeOnSelected(this.loggedInuserDetails, 5).subscribe((response) => {
      if (response && response["data"]) {
        this.selectedPreSalesEmployeeName = response["data"];
      }
    });
  }

  getProjectName = () => {
    //------- Show All Project Names in Create SiteVisit -------//
    this.GetSelectedProjectSubscription = this.salesLeadDetailsService.GetSelectedProject(this.loggedInuserDetails).subscribe((response) => {
      if (response && response["data"]) {
        this.allProjectNames = response["data"];
      }
    })
  }

  updateLeadDetails = (leadinfoDetails, leadDetailsForm) => {
    //************* if Presales is Reassign execute this code **************//
    if (this.leadinfoDetails.SalesAgentAssignedId !== this.SalesAgentAssingedid) {
      this.currentsales = this.salesEmployeesName.filter(x => x['EmployeeId'] === parseInt(this.leadinfoDetails.SalesAgentAssignedId))[0]['Name'];   //filter name of Current Sales agent from Json  
      this.interactionModel.Details = "Sales Agent changed from " + this.leadinfoDetails.name + " to " + this.currentsales + ".";    //Insert Interaction after sales Agent Change
      this.interactionModel.interactiontype = "PreSales Reassign";
    }
    //************* End **************//
    this.salesLeadDetailsService.UpdateLeadDetails(this.leadinfoDetails, this.loggedInuserDetails).subscribe((response) => {
      if (response && response['successful']) {
        //  this.showSuccessBar("Lead Details Update Successfully")
        this.LeadshowSuccessfullMessage = 'Lead Details Update Successfully';
        this.gotoOrderBtn = this.leadinfoDetails.ReferralStatus === 'Booked' ? true : false;
        if (this.interactionModel.Details && this.interactionModel.Details !== '') {
          this.onInteractionSubmit(this.interactionModel, null);
        }
      } else {
        //  this.showFailedBar("Lead Details Not Update Successfully")
        this.LeadshowNotSuccessfullMessage = 'Lead Details Not Update Successfully';
      }
      setTimeout(() => {
        this.LeadshowSuccessfullMessage = '';
        this.LeadshowNotSuccessfullMessage = '';
      }, 5000);
    });
    this.dsbSalesAgent = true;
  }

  goToLeadDetailsTab = (gototab) => {
    //-------Tab switch to Tab no:-15 and 7-------//
    this.emitClickLeadDetails.emit(gototab);
  }

  onInteractionSubmit = (interactionModel, interactionForm) => {
    //------- Creating New Interaction -------//
    this.insertInteractionStatusSubscription = this.salesLeadDetailsService.insertInteractionStatus(this.loggedInuserDetails, interactionModel, this.leadDetails).subscribe((response) => {
      if (response['successful']) {
        this.interactionModel = <IinteractionModel>{};
        this.InteractionshowSuccessfullMessage = "Interaction Inserted Successfully";
        this.sharedService.changeSalesIneractionDetails();
      } else {
        this.InteractionshowNotSuccessfullMessage = "Interaction Not Inserted Successfully";
      }
      setTimeout(() => {
        this.InteractionshowSuccessfullMessage = '';
        this.InteractionshowNotSuccessfullMessage = '';
      }, 5000);
      this.interactionModel.followUp = "";
      if (interactionForm !== undefined && interactionForm !== '') {
        interactionForm.form.markAsPristine();
        interactionForm.form.markAsUntouched();
      }
    });
  }

  onFollowupCreate = (leadinfoDetails, interactionForm) => {
    //------- For Follow Up Creation -------//
    this.leadinfoDetails.FollowUPTime = this.leadFollowUPTime ? this.leadFollowUPTime.toLocaleTimeString() : leadinfoDetails.FollowUPTime;
    leadinfoDetails.FollowUp = 'yes';
    leadinfoDetails.FollowUpStatus = 'scheduled';
    leadinfoDetails.FollowUpType = 'Call';
    this.updateFollowUpStatusSubscription = this.salesLeadDetailsService.updateFollowUpStatus(this.loggedInuserDetails, leadinfoDetails, this.id).subscribe((response) => {
      if (response['successful']) {
        this.showSuccessfullMessage = "FollowUp Inserted Successfully";
        leadinfoDetails.FollowUpTime = "";
        this.sharedService.changeSalesIneractionDetails();
        // after Followup Interaction Occur
        leadinfoDetails.Details = 'Followup Created with Remark:- ' + leadinfoDetails.Agenda;
      } else {
        this.showNotSuccessfullMessage = "FollowUp Not Inserted Successfully";
      }
      setTimeout(() => {
        this.showSuccessfullMessage = '';
        this.showNotSuccessfullMessage = '';
      }, 5000);
    });
  }

  replaceAll = (string, target, replacement) => {
    //---------Use Property To Replace All Target Characters------//
    return string.split(target).join(replacement);
  };

  clearMessageInput = (messageForm) => {
    messageForm.form.markAsPristine();
    messageForm.form.markAsUntouched();
    this.messageTemplate = "";
    this.ProjectName = "";
  }

  onSiteVisitCreate = (siteVisitModel, createSiteVisitForm) => {
    //-------For Create New SiteVisit-------//
    siteVisitModel.time = this.siteVisitModel.PreferredTime.toLocaleTimeString();
    this.statusDetails = `${this.leadDetails.ReferralStatus}#**#${SiteVisitStatus}`;
    this.leadDetails.ReferralStatus = this.statusDetails;
    this.createSiteVisitSubscription = this.salesLeadDetailsService.createSiteVisit(this.loggedInuserDetails, this.leadDetails, siteVisitModel).subscribe((response) => {
      if (response['successful']) {
        this.SiteshowSuccessfullMessage = "SiteVisit Inserted Successfully";
        this.sharedService.changeSalesIneractionDetails();
      } else {
        this.SiteshowNotSuccessfullMessage = "SiteVisit Not Inserted Successfully";
      }
      setTimeout(() => {
        this.SiteshowSuccessfullMessage = '';
        this.SiteshowNotSuccessfullMessage = '';
      }, 5000);
      this.clearSiteVisitInput(createSiteVisitForm);
    })
  }

  clearSiteVisitInput = (createSiteVisitForm) => {
    this.siteVisitModel = <IsiteVisitModel>{};
    this.siteVisitModel.PreferredProject = "";
    createSiteVisitForm.form.markAsPristine();
    createSiteVisitForm.form.markAsUntouched();
  }

  getToday(): string {
    //------- can not select future date -------//
    return new Date().toISOString().split('T')[0];
  }

  onDialCall = () => {
    //------- For Dial Call(Calling Functionality) -------//
    if (this.from && this.To && this.from !== null) {
      this.disableCallBtn = true;                                          //disable call button after first click for 10seconds
      // this.messageService.add({ key: 'callNow', severity: 'warn', life: 10000 });       //for show toast Message for call button click.
      this.salesLeadDetailsService.onCall(this.loggedInuserDetails, this.To, this.from, this.leadDetails).subscribe((response) => {
        if (response) {
        }
      }); setTimeout(() => {
        this.disableCallBtn = false;
      }, 10000);
    } else {
      this.showFailedBar("Sorry mobile No is not available");
    }
  }

  getAlternateNo = () => {
    //************ Select Alternate Mobile No. To Call *************//
    if (this.leadinfoDetails.AlternateNo !== undefined && this.leadinfoDetails.AlternateNo !== null)
      this.alternateNo = this.leadinfoDetails.AlternateNo.split(',');
  }

  onChangeCountryForAlternateNo = (select) => {
    if (select && select.value && select.value != '') {
      //-------Add country code while call on Alernate Mobile No.-------//
      if (this.leadinfoDetails.AlternateNo) {
        this.from = this.loggedInuserDetails.MobileNo;
        this.To = select.value.trim();
      }
    } else {
      this.To = this.leadDetails.MobileNo;
    }
  }

  onReject() {
    //-------hide the Toast after click on Close Button-------//
    this.messageService.clear('c');
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

  ngOnDestroy = () => {
    this.allSalesEmployeeSubscribtion ? this.allSalesEmployeeSubscribtion.unsubscribe() : null;
    this.updateLeadDetailsWithSiteVisitSubscription ? this.updateLeadDetailsWithSiteVisitSubscription.unsubscribe() : null;
    this.GetSelectedProjectSubscription ? this.GetSelectedProjectSubscription.unsubscribe() : null;
    this.insertInteractionStatusSubscription ? this.insertInteractionStatusSubscription.unsubscribe() : null;
    this.updateFollowUpStatusSubscription ? this.updateFollowUpStatusSubscription.unsubscribe() : null;
    this.createSiteVisitSubscription ? this.createSiteVisitSubscription.unsubscribe() : null;
    this.preSalesEmpNameSubscribtion ? this.preSalesEmpNameSubscribtion.unsubscribe() : null;
  }
}