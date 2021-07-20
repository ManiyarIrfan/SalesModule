import { Component, OnInit, Input, OnChanges, SimpleChanges, ViewChild, OnDestroy, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap';
import { Subscription } from 'rxjs';
import { MessageService } from 'primeng/api';
import { SalesLeadDetailsService } from 'src/app/shared/services/employee/sales-lead-details.service';
import { PreSalesleadDetailsService } from "src/app/shared/services/employee/pre-saleslead-details.service";
import { SharedService } from 'src/app/shared/services/shared/shared.service';
import { EoipdfService } from 'src/app/shared/services/shared/eoipdf.service';
import { MatSnackBar } from '@angular/material';
import { IloggedInuserDetails } from 'src/app/shared/models/Authentication/loggedInuserDetails.model';
import { IleadinfoDetails, IemployeeName, IselectedPreSalesEmployeeName, Ileadinfo, IinteractionModel, IcallCheckList } from 'src/app/shared/models/employeeModel/opportunity-details.model';
import { object } from '@amcharts/amcharts4/core';
const tab7 = `tab7`;

@Component({
  selector: 'tru-opportunity-details',
  templateUrl: './opportunity-details.component.html',
  styleUrls: ['./opportunity-details.component.scss']
})
export class OpportunityDetailsComponent implements OnChanges, OnInit, OnDestroy {
  public loggedInuserDetails: IloggedInuserDetails = <IloggedInuserDetails>{};
  public leadinfoDetails: IleadinfoDetails = <IleadinfoDetails>{};
  public checkStatus: string = '';
  public selectedProjectNames: string;
  public employeeName: IemployeeName[] = [];
  public selectedPreSalesEmployeeName: IselectedPreSalesEmployeeName[] = [];
  public selectedReportingto: string;
  public isShow: boolean = false;
  public showSalesAgent: boolean = true;
  public isEditFields: boolean;
  public Role: number = 3
  public statusHistory: string;
  public arrString: string[];
  public disableAllFields: boolean = false;
  public isShowConfirmationMsg: string;
  public disableSubmitBtn: boolean = true;
  public currentsales: string;
  public leadinfo: Ileadinfo = <Ileadinfo>{};
  public SalesAgentAssingedid: any = [];
  public enableUpdateName: boolean = false;
  public disableNameFields: boolean = false;
  public currentIndexNo: number;
  public indexLength: number;
  public allReferralId: number[];
  public referralId: number;
  public gotoOrderBtn: boolean = false;
  public interactionModel: IinteractionModel = <IinteractionModel>{};
  public enquirydisableAllFields: boolean = true;
  public referralInfoDisplaySubscribtion: Subscription;
  public updateStatusSubscribtion: Subscription;
  public preSalesEmpNameSubscribtion: Subscription;
  public AllSalesEmployeeSubscribtion: Subscription;
  public selectProjectListSubscribtion: Subscription;
  public insertInteractionStatusSubscription: Subscription;
  public callObservationSubscription: Subscription;
  public callObservationTransactionSubscription: Subscription;
  public dndArchitectDetail: Subscription;
  public callObservationList: object[] = [];
  public callCheckList: IcallCheckList[] = [];
  public isLoading: boolean = false;
  public customerchoices: string[] = [];
  public showemail = 0;
  public flagEdit: boolean = false;

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
  public StatusChangeInfo: any = [];
  @ViewChild('ConfirmationModel', { static: false }) public ConfirmationModel: ModalDirective;
  @ViewChild('dndArchitectsPopup', { static: false }) public dndArchitectsPopup: ModalDirective;
  @ViewChild('showOnCallNotesPopup', { static: false }) public showOnCallNotesPopup: ModalDirective;

  @Input() referralInfo: any;
  @Output() emitEventorder = new EventEmitter<any>();
  private _EventSubscription: Array<Subscription> = [];

  constructor(
    private salesLeadDetailsService: SalesLeadDetailsService,
    private preSalesleadDetailsService: PreSalesleadDetailsService,
    public router: Router,
    private sharedService: SharedService,
    public messageService: MessageService,
    private eoipdfService: EoipdfService,
    private snackBar: MatSnackBar) { }
  ngOnInit() {
    this.loggedInuserDetails = JSON.parse(localStorage.getItem('LoggedinUser'));
    this.getSelectedProjectsList();
    this.getAllSalesEmployeeName();
    this.getAllPresalesEmployeeName();
  }
  ngOnChanges(changes: SimpleChanges) {
    //-------Get All Referral information-------//
    if (changes.referralInfo && this.referralInfo) {
      this.loggedInuserDetails = JSON.parse(localStorage.getItem('LoggedinUser'));
      this.referralId = changes.referralInfo.currentValue.LeadId;
      this.allReferralId = changes.referralInfo.currentValue.allId;
      //-------get index length and current index number-------//
      if (this.allReferralId && this.allReferralId !== undefined) {
        this.indexLength = this.allReferralId.length - 1;
        this.currentIndexNo = this.allReferralId.indexOf(this.referralId);
      }
      this.referralInfoDisplay(this.referralId);
    } else {
      this.disableAllFields = true;
    }
    //-------End-------//
  }
  receiveMessage($event) {
    //************* after sitevisit get updated data again **************//
    this.referralInfoDisplay($event);
    //************* End **************//
  }
  //-------Open call obervation popup-------//
  callPopUpShow = ($event) => {
    if ($event === true)
      this.showOnCallNotesPopup.show();
    this.callObservationList = [];
  }
  //-------on radio or dropdown change push & pop value to array-------//
  onChange = (string, checkList, index, status) => {
    let tagName = (status === 'radio') ? string : string;
    this.callCheckList[index]['Selected'] = checkList['Selected'] = string;
    let indexNo = this.callObservationList.findIndex(x => Number(x['key']) === Number(checkList.TagId));
    if (indexNo !== -1) {
      this.callObservationList[indexNo]['tag'] = tagName;
    } else {
      this.callObservationList.push({ key: checkList.TagId, name: checkList.Tag, tag: tagName });
    }
  }
  //------- get calltag data as per referralId -------//
  callObservationData = () => {
    this.leadinfoDetails['UserType'] = 'Referral';
    this.callObservationSubscription = this.salesLeadDetailsService.callObservation(this.loggedInuserDetails, this.leadinfoDetails).subscribe((response) => {
      if (response && response['data'] && response['data'].length > 0) {
        this.callCheckList = [];
        this.callCheckList = response['data'];
        this.callCheckList.map(element => {
          let splitList = element.SubTag.split(',');
          let ArrayList = [];
          splitList.map(item => {
            ArrayList.push({ key: item, label: item });
          });
          element['ArrayList'] = ArrayList;
          element['Selected'] = element.Answer ? ((splitList.length > 2) ? { key: element.Answer, label: element.Answer } : element.Answer) : null;
        });
        this.isLoading = true;
      } else {
        this.isLoading = false;
      }
    });
  }
  //------- success snabar method -------//
  showSuccessBar = (message: string) => {
    this.snackBar.open(message, null, { duration: 5000, panelClass: ['blue-snackbar'] });
  }
  //------- failed snakbar method -------//
  showFailedBar = (message: string) => {
    this.snackBar.open(message, null, { duration: 7000, panelClass: ['red-snackbar'] });
  }
  //-------Insert call tagging data-------//
  callObservationTransaction = () => {
    this.callObservationTransactionSubscription = this.salesLeadDetailsService.InsertCallObservationData(this.loggedInuserDetails, this.referralId, this.callObservationList).subscribe((response) => {
      if (response) {
        this.showSuccessBar('Call Observation details Submitted Successfully')
      } else {
        this.showFailedBar('failed To Submit');
      }
      this.showOnCallNotesPopup.hide();
    });
  }
  referralInfoDisplay = (referralId) => {
    //------- Referral Information display on Referral Id-------//
    this.referralInfoDisplaySubscribtion = this.salesLeadDetailsService.getInfoByreferralId(this.loggedInuserDetails, referralId).subscribe((response) => {
      if (response && response["data"][0]) {
        this.leadinfoDetails = response["data"][0];
        this.leadinfoDetails['MobileNoforWA'] = response["data"][0].MobileNo;
        let getDate = this.leadinfoDetails.Dob ? this.leadinfoDetails.Dob.split('T') : null;
        this.leadinfoDetails['Dob'] = getDate ? getDate[0] : null;
        this.leadinfo.name = this.leadinfoDetails.SalesAgentAssinged;
        this.leadinfo.Id = this.leadinfoDetails.SalesAgentAssignedId;
        this.StatusInfo;
        this.leadinfo.referralStatus = this.leadinfoDetails.ReferralStatus;
        this.leadinfo.AlternateEmail = this.leadinfoDetails.AlternateEmail;
        Object.assign(this.leadinfo, this.leadinfoDetails);
        this.leadinfoDetails['IsReferralActive'] = this.referralInfo.IsReferralActive ? this.referralInfo.IsReferralActive : this.leadinfoDetails['IsActive'];
        // this.enquirydisableAllFields = (this.leadinfoDetails.SalesAgentAssignedId === this.loggedInuserDetails['EntityId'] || this.loggedInuserDetails.Role === 1) ? false : true;
        if (this.referralInfo.IsReferralActive === false) {
          this.enquirydisableAllFields = this.referralInfo.IsReferralActive !== false ? (this.leadinfoDetails.SalesAgentAssignedId === this.loggedInuserDetails['EntityId'] || (this.loggedInuserDetails['TenantId'] === 0 && this.loggedInuserDetails['EngagementType'] !== "On Demand") || this.loggedInuserDetails.Role === 1) ? false : true : true;
        } else {
          this.enquirydisableAllFields = (this.leadinfoDetails.SalesAgentAssignedId === this.loggedInuserDetails['EntityId'] || (this.loggedInuserDetails['TenantId'] === 0 && this.loggedInuserDetails['EngagementType'] !== "On Demand") || this.loggedInuserDetails.Role === 1) ? false : true;
        }
        this.callObservationData();
      }
    });
    //------- End -------//
  }
  // ------- open and Download EOI Pdf ------- //
  printPDf = () => {
    this.eoipdfService.printPdf(this.leadinfoDetails, 'GeneratePDF');
  }
  preReferralId = () => {
    this.enableUpdateName = this.isEditFields = false;
    //************* get previous referral id and get details of that id **************//
    if (this.currentIndexNo != -1) {
      this.currentIndexNo -= 1;
      if (this.currentIndexNo > -1) {
        this.referralId = this.allReferralId[this.currentIndexNo];
        this.enableUpdateName = false;
      } else {
        this.currentIndexNo = this.indexLength;
        this.referralId = this.allReferralId && this.allReferralId[this.currentIndexNo];
      }
      this.referralInfoDisplay(this.referralId);
    }
    //************* end **************//
  }
  nextReferralId = () => {
    this.enableUpdateName = this.isEditFields = false;
    //************* get next referral id and get details of that id **************//
    if (this.currentIndexNo != -1) {
      this.currentIndexNo += 1;
      if (this.currentIndexNo <= this.indexLength) {
        this.referralId = this.allReferralId[this.currentIndexNo];
        this.enableUpdateName = false;
      } else {
        this.currentIndexNo = 0;
        this.referralId = this.allReferralId && this.allReferralId[this.currentIndexNo];
      }
      this.referralInfoDisplay(this.referralId);
    }
    //************* end **************//
  }
  receiveData = ($event) => {
    // //------- for receive id from Search -------//
    this.referralId = $event.ReferralId;
    this.referralInfoDisplay(this.referralId);
    this.disableAllFields = ($event.SalesAgentAssignedId === this.loggedInuserDetails['EntityId'] || this.loggedInuserDetails.Role === 1) ? false : true;
    this.disableAllFields = $event.IsActive === 1 ? false : true;
    //------- End -------//
  }

  updateStatus = (leadModal) => {
    //-------For Updating Status-------//
    if (leadModal.ReferralStatus != this.leadinfo.referralStatus) {
      leadModal.ReferralStatus = `${this.leadinfo.referralStatus}#**#${leadModal['ReferralStatus']}`;
      switch (this.leadinfoDetails.StoreStatus) {
        case 'Unqualified':
          leadModal.InteractionType = 'Unqualified by sales';
          break;
        case 'Lost':
          leadModal.InteractionType = 'Lost by sales';
          break;
        default:
          leadModal.InteractionType = 'Note';
          break;
      }
    }
    this.disableSubmitBtn = true;
    if (this.leadinfo.Id !== this.SalesAgentAssingedid && this.SalesAgentAssingedid.length > 0) {
      this.currentsales = this.employeeName.filter(x => x.EmployeeId === parseInt(this.SalesAgentAssingedid))[0].Name;   //filter name of Current Sales agent from Json  
      this.interactionModel.Details = "Sales Agent changed from " + this.leadinfo.name + " to " + this.currentsales + ".";    //Insert Interaction after sales Agent Change
      this.interactionModel.interactionType = 'PreSales Reassign';
    }
    this.updateStatusSubscribtion = this.salesLeadDetailsService.UpdateLeadDetails(leadModal, this.loggedInuserDetails).subscribe((response) => {
      if (response && response['successful']) {
        this.showSuccessBar("Record updated sucessfully.");
        this.referralInfoDisplay(this.referralInfo);
        this.isEditFields = false;
        // -------For Again Display Status in Grid------//
        this.statusHistory = leadModal.ReferralStatus;
        this.arrString = this.statusHistory.split('#**#');
        leadModal.ReferralStatus = this.arrString[this.arrString.length - 1];
        this.enquirydisableAllFields = leadModal.ReferralStatus === 'Assigned to Presales' ? true : false;
        this.checkStatus = leadModal.ReferralStatus;
        //-------End--------//
        if (this.interactionModel.Details && this.interactionModel.Details !== '') {
          this.onInteractionSubmit(this.interactionModel, 'SalesChange');
        }
        if (leadModal.ReferralStatus === 'Booked') {
          this.gotoOrderBtn = true;
          this.messageService.add({ key: 'c', sticky: true, severity: 'warn' });
        } else {
          this.gotoOrderBtn = false;
        }
        this.sharedService.changeSalesIneractionDetails();
        this.disableSubmitBtn = false;
        this.SalesAgentAssingedid = '';
      } else {
        this.showFailedBar("Record updation failed.");
      }
      this.ConfirmationModel.hide();
      this.leadinfoDetails.StatusChangeReason = '';
      this.leadinfoDetails.remarks = '';
      this.showSalesAgent = true;
    });
    //-------End-------//
  }
  onInteractionSubmit = (interactionModel, Type) => {
    //------- Creating New Interaction -------//
    let intractionDetails = [];
    this.callObservationList.map((element) => {
      let string = element['name'] + ':-' + element['tag'];
      intractionDetails.push(string);
    });
    let selectedRadioButtons = intractionDetails.join(',');
    interactionModel.Details = (Type === 'callInteraction')
      ? ('Call Interaction Note :' + interactionModel.Details + ' And Selected Check List are:' + selectedRadioButtons)
      : interactionModel.Details;
    this.insertInteractionStatusSubscription = this.salesLeadDetailsService.insertInteractionStatus(this.loggedInuserDetails, interactionModel, this.leadinfoDetails).subscribe((response) => {
      if (response['successful']) {
        this.interactionModel = <IinteractionModel>{};
        this.sharedService.changeSalesIneractionDetails();
      }
    });
    //-------End-------//
  }
  goToLeadDetailsTab = () => {
    //-------Tab switch to Tab no:-7 for Order-------//
    this.leadinfoDetails['redirectTo'] = true;
    this.emitEventorder.emit(this.leadinfoDetails);
    this.sharedService.shareLeadDetails(tab7);
    //-------End-------//
  }
  getSelectedProjectsList = () => {
    //-------Get list of all Projcts-------//
    this.selectProjectListSubscribtion = this.salesLeadDetailsService.GetSelectedProject(this.loggedInuserDetails).subscribe((response) => {
      if (response && response["data"]) {
        this.selectedProjectNames = response["data"];
      }
    });
    //-------End-------//
  }
  getAllSalesEmployeeName() {
    //-------Get All Employee Name In Sales Agent Assign-------//
    this.AllSalesEmployeeSubscribtion = this.salesLeadDetailsService.getAllSalesEmployeeOnSelected(this.loggedInuserDetails, this.Role).subscribe((response) => {
      if (response && response["data"]) {
        this.employeeName = response["data"];
      }
    });
    //-------End-------//
  }
  getAllPresalesEmployeeName() {
    //-------Get All Employee Name of pre-Sales Agent Assign-------//
    this.Role = 5;
    this.preSalesEmpNameSubscribtion = this.salesLeadDetailsService.getAllSalesEmployeeOnSelected(this.loggedInuserDetails, this.Role).subscribe((response) => {
      if (response && response["data"]) {
        this.selectedPreSalesEmployeeName = response["data"];
      }
    });
    //-------End-------//
  }
  GetSelectedReportingTo = (salesEmployeeName) => {
    //-------Get All Employee Name Who reporting to Login-------//
    this.SalesAgentAssingedid = salesEmployeeName;
    //-------End-------//
  }
  // ** Action for To check & Email Already exist in DB ** //
  onBlurEvent(email) {
    var emailPattern: any = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    if (email && emailPattern.test(email)) {
      const emailValidationSub = this.preSalesleadDetailsService
        .emailValidation(this.loggedInuserDetails, email)
        .subscribe((response) => {
          if (response && response["data"]) {
            this.showemail = response["data"][0].length;
            if (this.showemail > 0) {
              this.disableSubmitBtn = true;
            } else {
              this.disableSubmitBtn = this.checkForChange(true);
              this.showemail = 0;
            }
          }
        });
      this._EventSubscription.push(emailValidationSub);
    }
  }
  // ** Action for To check & Unable / Disable Save Button ** //
  checkForChange = (Flag) => {
    let counter = 0;
    let Head = ('AlternateNo,AlternateEmail,Dob,FirstName,LastName,SalesAgentAssignedId,ReferralStatus').split(',');
    Head.forEach(element => {
      this.leadinfoDetails['' + element] === '' ? this.leadinfoDetails['' + element] = null : null;
      this.leadinfo['' + element] === '' ? this.leadinfo['' + element] = null : null;
      if (this.leadinfo['' + element] !== this.leadinfoDetails['' + element]) {
        counter = counter + 1;
      }
    });
    Flag = (this.leadinfoDetails['AlternateEmail'] && this.showemail && this.showemail > 0) ? true : (counter > 0 ? false : true);
    return this.disableSubmitBtn = Flag;
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
  onChangeSelect = (typeValue) => {
    //-------Fields Shows As per the Status-------//
    typeValue = this.leadinfoDetails.ReferralStatus
    if (typeValue == 'Site Visit Scheduled' || typeValue == 'Site Visit Done') {
      this.isShow = true;
    }
    else if (typeValue === 'Lost' || typeValue == 'Unqualified' || typeValue == 'Warm' || typeValue == 'Cold' || typeValue == 'Assigned to Presales') {
      switch (typeValue) {
        case 'Lost':
          this.StatusChangeInfo = [
            { key: "Booked with competitor", value: "Booked with competitor" },
            { key: "Invalid Customer Contact Number", value: "Invalid Customer Contact Number" },
            { key: "False Enquiry", value: "False Enquiry" },
            { key: "Not interested", value: "Not interested" }]
          break;
        case 'Unqualified':
          this.StatusChangeInfo = [
            { key: "No Followup", value: "No Followup" },
            { key: "Not Interested", value: "Not Interested" },
            { key: "Duplicate Customer", value: "Duplicate Customer" },
            { key: "Looking for Commercial", value: "Looking for Commercial" },
            { key: "Dropped the plan", value: "Dropped the plan" },
            { key: "Not answering / Responding", value: "Not answering / Responding" },
            { key: "Is a Channel Partner", value: "Is a Channel Partner" },
            { key: "Customer already booked property in past with us", value: "Customer already booked property in past with us" }]
          break;
        case 'Warm':
          this.StatusChangeInfo = [
            { key: "Had long discussion on call", value: "Had long discussion on call" },
            { key: "Interested in Sitevisit", value: "Interested in Sitevisit" },
            { key: "Second Sitevisit", value: "Second Sitevisit" },
            { key: "Spend long time during Sitevisit", value: "Spend long time during Sitevisit" },
            { key: "Matches customer requirements", value: "Matches customer requirements" },
            { key: "Matches customer Preferred location", value: "Matches customer Preferred location" },
            { key: "Multiple incoming calls", value: "Multiple incoming calls" }
          ]
          break;
        case 'Cold':
          this.StatusChangeInfo = [
            { key: "Loan Issues", value: "Loan Issues" },
            { key: "Budget issues", value: "Budget issues" },
            { key: "Customer Postponed property buying", value: "Customer Postponed property buying" },
            { key: "Requirement for lower floors", value: "Requirement for lower floors" },
            { key: "Location issue", value: "Location issue" },
            { key: "Apartment size issue", value: "Apartment size issue" },
            { key: "Possession mismatch", value: "Possession mismatch" },
            { key: "Looking for smaller apartment", value: "Looking for smaller apartment" },
            { key: "Looking for Plot", value: "Looking for Plot" },
            { key: "Looking for larger apartment", value: "Looking for larger apartment" }
          ]
          break;
      }
      this.leadinfoDetails.StoreStatus = typeValue;
      this.isShow = false;
      this.isShowConfirmationMsg = 'Are you Sure you want to change the status to ' + typeValue + '? This lead will be Deleted from your list.';
      this.ConfirmationModel.show();
      this.leadinfoDetails.StatusChangeReason = "";
    }
    else {
      this.isShow = false;
    }
    //-------End-------//
  }
  onReassingedBtnClick = () => {
    //-------For Sales Agent Assingn Button-------//
    this.showSalesAgent = false;
    this.leadinfoDetails.salesAgentAssinged = "";
    //-------End-------//
  }
  updateEnquiryName = () => {
    this.flagEdit = !this.flagEdit;
    this.enableUpdateName = this.flagEdit;
    this.isEditFields = this.flagEdit;
  }
  close = () => {
    //-------When Assign to Presales Pop-up select "Cancel" and "Cross" button Option-------//
    this.ConfirmationModel.hide();
    this.leadinfoDetails.ReferralStatus = this.referralInfo.ReferralStatus;
    this.leadinfoDetails.StatusChangeReason = "";
    this.leadinfoDetails.remarks = "";
    //-------End-------//
  }

  //******* Get Selected and Preference Data *******//
  getCustomerSelectedData = (Input) => {
    this.dndArchitectDetail = this.salesLeadDetailsService.getCustomerDetail(this.loggedInuserDetails, this.referralId, "Referral", Input).subscribe((response) => {
      if (response && response["data"][0].length > 0) {
        this.customerchoices = response["data"][0];
      } else {
        this.customerchoices = [];
      }
    });
  }

  ngOnDestroy() {
    //------ Unsubscribe All Service -------//
    this.referralInfoDisplaySubscribtion ? this.referralInfoDisplaySubscribtion.unsubscribe() : null;
    this.updateStatusSubscribtion ? this.updateStatusSubscribtion.unsubscribe() : null;
    this.preSalesEmpNameSubscribtion ? this.preSalesEmpNameSubscribtion.unsubscribe() : null;
    this.AllSalesEmployeeSubscribtion ? this.AllSalesEmployeeSubscribtion.unsubscribe() : null;
    this.selectProjectListSubscribtion ? this.selectProjectListSubscribtion.unsubscribe() : null;
    this.dndArchitectDetail ? this.dndArchitectDetail.unsubscribe() : null;
  }
  onReject() {
    this.messageService.clear('c');
  }
  trackByFn(item) {
    return item.id; // unique id corresponding to the item
  }
}