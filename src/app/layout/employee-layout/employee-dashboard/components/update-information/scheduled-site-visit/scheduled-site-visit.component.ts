import { Component, OnInit, ViewChild, EventEmitter, Output, HostListener, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap';
import { SharedService } from 'src/app/shared/services/shared/shared.service';
import { ScheduledSiteVisitService } from 'src/app/shared/services/employee/scheduled-site-visit.service';
import { Subscription } from 'rxjs';
import { IloggedInuserDetails } from 'src/app/shared/models/Authentication/loggedInuserDetails.model';
import { IrefModel, IemployeeName, Iinteractioninfo } from 'src/app/shared/models/employeeModel/scheduled-site-visit.model';
import { MatSnackBar } from '@angular/material';
const tab3 = `tab3`;

@Component({
  selector: 'tru-scheduled-site-visit',
  templateUrl: './scheduled-site-visit.component.html',
  styleUrls: ['./scheduled-site-visit.component.scss']
})

export class ScheduledSiteVisitComponent implements OnInit, OnDestroy {
  public loggedInuserDetails: IloggedInuserDetails = <IloggedInuserDetails>{};
  public isSpinnerActive: boolean;
  public DataNotFoundError: string;
  public orgshowDataNotFoundError: boolean;
  public getAllPresalesLead: string[] = [];
  public showReferral: string[] = [];
  public refModel: IrefModel = <IrefModel>{};
  public tabActive: string;
  public employeeName: IemployeeName[] = [];
  public Role: number = 3;
  public referralDetails: IrefModel = <IrefModel>{};
  public p1: string;
  public currentsalesId: number;
  public currentsales: string;
  public enquiryException: boolean;
  public referralException: boolean;
  public searchText: string;
  public interactioninfo: Iinteractioninfo = <Iinteractioninfo>{};
  public selectedProjectNames: string[] = [];

  public interactionDetailsSubscription: Subscription;
  public reassignSalesForReferralSubscription: Subscription;
  public searchEnquirySubscription: Subscription;
  public GetAllSalesEmployeeNameSubscription: Subscription;
  public getDetailsSubscription: Subscription;
  public getprojectListSubscription: Subscription;
  public svDetailsForCpSubscription: Subscription;

  @Output() emitEvent = new EventEmitter<any>(); // used for lead Generation data send
  @ViewChild('leadDetailsModel', { static: false }) public leadDetailsModel: ModalDirective;

  constructor(public router: Router,
    private sharedService: SharedService,
    private scheduledSiteVisitService: ScheduledSiteVisitService, private snackBar: MatSnackBar) { }

  ngOnInit() {
    if (localStorage.getItem('LoggedinUser')) {
      this.loggedInuserDetails = JSON.parse(localStorage.getItem('LoggedinUser'));
      this.getDetails();
      this.GetAllSalesEmployeeName();
      this.getprojectList();
    } else {
      this.router.navigate(['/login']);
    }
  }

  getprojectList = () => {
    //-------Get All ProjectName-------//
    this.getprojectListSubscription = this.scheduledSiteVisitService.GetProjectNameList(this.loggedInuserDetails).subscribe((response) => {
      if (response && response["data"]) {
        this.selectedProjectNames = response["data"];
      }
    });
  }

  enterClick = (event, searchText) => {
    if (event.keyCode == 13) {
      this.searchEnquiry(searchText);
    }
  }

  searchEnquiry = (term) => {
    if (term === "") {
      this.getDetails();
    }
    else {
      this.searchEnquirySubscription = this.scheduledSiteVisitService.search(this.loggedInuserDetails, term).subscribe((response) => {
        if (response && response['data'][0]) {
          if (response['data'][0].length > 0) {
            this.getAllPresalesLead = response['data'][0];
            this.enquiryException = false;
          } else {
            this.enquiryException = true;
          }
          if (response['data'][1].length > 0) {
            this.showReferral = response['data'][1];
            this.referralException = false;
            this.bindReferralStatus(this.showReferral);
          } else {
            this.referralException = true;
          }
        }
      });
    }
  }

  getDetails = () => {
    //************* get All Organisation details **************//
    this.isSpinnerActive = true;
    this.getDetailsSubscription = this.scheduledSiteVisitService.getEnquiryandReferralDetails(this.loggedInuserDetails).subscribe((response) => {
      if (response) {
        if (response['data'][0].length > 0) {
          this.getAllPresalesLead = response['data'][0];
          this.enquiryException = false;
        } else {
          this.enquiryException = true;
        }
        if (response['data'][1].length > 0) {
          this.showReferral = response['data'][1];
          this.referralException = false;
        } else {
          this.referralException = true;
        }
        this.bindReferralStatus(this.showReferral);
      }
      // }
      this.isSpinnerActive = false;
    });
  }

  GetAllSalesEmployeeName() {
    //************* Get All Employee Name In Sales Agent Assign *************//
    this.GetAllSalesEmployeeNameSubscription = this.scheduledSiteVisitService.getAllSalesEmployeeOnSelected(this.loggedInuserDetails, this.Role).subscribe((response) => {
      if (response && response["data"]) {
        this.employeeName = response["data"];
      }
    });
    //************* End *************//
  }
  bindReferralStatus = (showReferral) => {
    showReferral.forEach(element => {
      let arr = element.ReferralStatus.split('#**#');
      element.ReferralStatus = arr[arr.length - 1];
      // element.Status = arr[arr.length - 1];                  // if store status in Another Variable
    });
  }

  openReassignModel = (Referral) => {
    this.referralDetails = Referral;
    this.refModel.ReferralId = this.referralDetails.ReferralId;
    this.refModel.Name = this.referralDetails.Name;
    this.refModel.SalesAgentAssignedId = this.referralDetails.SalesAgentAssignedId;
    this.refModel.PreferredProjectId = this.referralDetails.PreferredProjectId;
    this.leadDetailsModel.show();
    this.searchText = '';
  }
  reassignSalesForReferral = (refModel) => {
    // ************* For Reassign Sales Agent ************* //
    this.currentsales = this.employeeName.filter(x => x.EmployeeId === parseInt(refModel.SalesAgentAssignedId))[0].Name;   //filter name of Current Sales agent from Json  

    this.referralDetails.ReferralStatus = 'Site Visit Done';
    this.reassignSalesForReferralSubscription = this.scheduledSiteVisitService.UpdateLeadDetails(this.referralDetails, this.loggedInuserDetails, refModel).subscribe((response) => {
      if (response && response['successful']) {
        this.interactionDetails();
        this.showSuccessBar("Record updated sucessfully.");
        this.getDetails();
        this.sitevisiteDetailsForCp(refModel);
      } else {
        this.showFailedBar("Record updation failed.");
      }
    });
  }
  // ******* sitevisit is refered by Cp or CRO then insert virtual amount in its account ******* //
  sitevisiteDetailsForCp = (refModel) => {
    this.svDetailsForCpSubscription = this.scheduledSiteVisitService.siteVisitInsert(this.loggedInuserDetails, refModel).subscribe((response) => {
    });
  }

  generateOpportunity = (leadDetails) => {
    //************* for Tab Switch to Opportunity **************//
    this.emitEvent.emit(leadDetails);
    this.tabActive = tab3;
    this.sharedService.shareLeadDetailsToGenerate(this.tabActive);
  }

  @HostListener('document:keyup', ['$event']) handleKeyUp(event) {
    if (event.keyCode === 27) {
      this.leadDetailsModel.hide();
    }
  }

  interactionDetails = () => {
    this.interactioninfo.Details = (this.referralDetails.SalesAgentAssigned !== this.currentsales) ? "Sales Agent changed from " + this.referralDetails.SalesAgentAssigned + " to " + this.currentsales + "." + " Customer Arrived For Site-Visit" : 'Customer Arrived For Site-Visit';    //Insert Interaction after sales Agent Change
    this.interactioninfo.EntityId = this.referralDetails.ReferralId;
    this.interactioninfo.UserType = this.referralDetails['UserType'];
    this.interactioninfo.interactionType = 'site visit conducted';
    this.interactionDetailsSubscription = this.scheduledSiteVisitService.interaction(this.loggedInuserDetails, this.interactioninfo).subscribe((response) => {
    });
  }
  ngOnDestroy() {
    this.interactionDetailsSubscription ? this.interactionDetailsSubscription.unsubscribe() : null;
    this.reassignSalesForReferralSubscription ? this.reassignSalesForReferralSubscription.unsubscribe() : null;
    this.searchEnquirySubscription ? this.searchEnquirySubscription.unsubscribe() : null;
    this.GetAllSalesEmployeeNameSubscription ? this.GetAllSalesEmployeeNameSubscription.unsubscribe() : null;
    this.getDetailsSubscription ? this.getDetailsSubscription.unsubscribe() : null;
    this.svDetailsForCpSubscription ? this.svDetailsForCpSubscription.unsubscribe() : null;
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
}
