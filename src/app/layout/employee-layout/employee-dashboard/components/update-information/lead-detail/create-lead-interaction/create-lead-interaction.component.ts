import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges, ViewChild, OnDestroy, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { AmazingTimePickerService } from 'amazing-time-picker';
import { MessageService } from 'primeng/api';
import { ModalDirective } from 'ngx-bootstrap';
import { Subscription } from 'rxjs';
import { PreSalesleadDetailsService } from 'src/app/shared/services/employee/pre-saleslead-details.service';
import { SharedService } from 'src/app/shared/services/shared/shared.service';
import { IloggedInuserDetails } from 'src/app/shared/models/Authentication/loggedInuserDetails.model';
import { MatSnackBar } from '@angular/material';
import { IleadinfoDetails, IallProjectNames, IsiteVisitModel, IEnquiryDetails } from 'src/app/shared/models/employeeModel/lead-detail.model';

@Component({
  selector: 'tru-create-lead-interaction',
  templateUrl: './create-lead-interaction.component.html',
  styleUrls: ['./create-lead-interaction.component.scss'],
  providers: [MessageService]
})
export class CreateLeadInteractionComponent implements OnInit, OnDestroy {
  public selectedTemplate: string[] = [];
  public To: number;
  public CC: string;
  public usertype: string = 'Enquiry';
  public loggedInuserDetails: IloggedInuserDetails = <IloggedInuserDetails>{};
  public leadinfoDetails: IleadinfoDetails = <IleadinfoDetails>{};
  public interactionModel: any = {};
  public selectedTime: string;
  public enquiryId: any;
  public empName: string;
  public interactionDetails: string;
  public messageModel: any = {};
  public messageTemplate: string;
  public ProjectName: string;
  public allProjectNames: IallProjectNames[] = [];
  public siteVisitModel: IsiteVisitModel = <IsiteVisitModel>{};
  public selectSitevisitTime: string;
  public id: number;
  public from: number;
  public disableAllFields: boolean = false;  //disable all fields till Enquiry is selected
  public disableSiteVisitButton: boolean = false;
  public disableMergeButton: boolean = false;
  public ContentType: string;
  public brochure: string;
  public newTemplate: string;
  public alternateNo: string[];
  public disableCallBtn: boolean = false;
  public EnquiryDetails: IEnquiryDetails = <IEnquiryDetails>{};
  public sitevisitDetails: any = [];
  public updateBtn: boolean = false;
  public offlineFieldsShow = true;                           // Offline Details Enter Fields hide and Show
  public disableFollowUpButton: boolean = false;
  public currentTime: string;
  public currentdate: string;
  public checkTime: string = '';
  public cancelFollowUpBtn: boolean = false;
  public dsbTemplate: boolean = false;
  public isloading: boolean = false;
  public followupdatattest: object[] = [];
  public p1: number;
  public projectNameSubscription: Subscription;
  public leadDeletedSubscription: Subscription;
  public enquiryDetailsSubscription: Subscription;
  public chooseTemplateSubscription: Subscription;
  public allSmsnameSubscription: Subscription;
  public insertSiteVisitSubscription: Subscription;
  public sendmessageSubscription: Subscription;
  public followupcreateSubscription: Subscription;
  public interactionSubmitSubScription: Subscription;
  public SiteVisitconfirmation: any = [
    { key: "Confirm", value: "Confirm" },
    { key: "Tentative", value: "Tentative" }];
  public offlineCallStatus: any = [
    { key: "Connected", value: "Connected" },
    { key: "Not Connected", value: "Not Connected" }];

  @Input() EnquiryInfoDetails: any;
  @Input() salesDisableAllFields: boolean;
  @Output() updatedata = new EventEmitter<any>();
  @Output() showCallPopup = new EventEmitter<boolean>();
  @ViewChild('followUpCancelModal', { static: false }) public followUpCancelModal: ModalDirective;
  @ViewChild('SVCancelModal', { static: false }) public SVCancelModal: ModalDirective;
  @ViewChild('CallPopUP', { static: false }) public CallPopUP: ModalDirective;
  @ViewChild('followupdatattestmodel', { static: false }) public followupdatattestmodel: ModalDirective;
  constructor(
    private preSalesleadDetailsService: PreSalesleadDetailsService,
    public router: Router,
    private sharedService: SharedService,
    private atp: AmazingTimePickerService,
    private messageService: MessageService,
    private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.loggedInuserDetails = JSON.parse(localStorage.getItem('LoggedinUser'));
    this.CC = this.loggedInuserDetails.UserEmail;
    this.from = this.loggedInuserDetails.MobileNo;
    this.empName = this.loggedInuserDetails.Firstname + ' ' + this.loggedInuserDetails.LastName;
    this.getProjectName();
    this.leadinfoDetails.FollowUp = '';
    this.leadinfoDetails.FollowUpStatus = '';
    this.siteVisitModel.PreferredProject = '';
    this.messageTemplate = '';
    this.ProjectName = '';
  }
  ngOnChanges(changes: SimpleChanges) {
    //************ For Enquiry Details Changes *************//
    if (changes.EnquiryInfoDetails && this.EnquiryInfoDetails && changes.EnquiryInfoDetails.previousValue != undefined) {
      this.EnquiryDetails = this.EnquiryInfoDetails[0][0];
      this.sitevisitDetails = this.EnquiryInfoDetails[1][0];
      this.EnquiryDetails['UserType'] = this.usertype;
      this.id = this.EnquiryDetails.EnquiryId;
       this.To = this.EnquiryDetails.DialNo;
      this.enquiryId = this.EnquiryDetails.EnquiryId;
      this.leadinfoDetails.FollowUpDate = this.EnquiryDetails['FollowUpDate'];
      this.selectedTime = this.EnquiryDetails['FollowUpTime'];
      this.leadinfoDetails.FollowUp = this.EnquiryDetails['FollowUp'];
      this.leadinfoDetails.FollowUpStatus = this.EnquiryDetails['FollowUpStatus'];
      this.leadinfoDetails.AlternateNo = this.EnquiryDetails['AlternateNo'];
      if (this.sitevisitDetails !== undefined && this.sitevisitDetails.InteractionType && this.sitevisitDetails.InteractionType !== 'Site Visit Canceled') {
        this.siteVisitModel.preDate = this.sitevisitDetails.SiteVisitDate;
        this.siteVisitModel.Details = this.sitevisitDetails.Details;
        this.siteVisitModel.PreferredProject = this.sitevisitDetails.ProjectName;
        this.selectSitevisitTime = this.sitevisitDetails.SiteVisitTime;
        this.updateBtn = true;
      } else {
        this.siteVisitModel = <IsiteVisitModel>{};
        this.selectSitevisitTime = '';
        this.updateBtn = false;
        this.siteVisitModel.PreferredProject = '';
        this.siteVisitModel.IsSVConfirm = this.SiteVisitconfirmation[0].value;
      }
      this.leadinfoDetails.Agenda = this.EnquiryDetails['FollowUpDetails'];
      this.disableAllFields = false;
      this.salesDisableAllFields = this.salesDisableAllFields;
      // this.salesDisableAllFields = (this.loggedInuserDetails['EntityId'] === this.EnquiryDetails['PresalesAgentAssigned'] || this.loggedInuserDetails.Role === 1) ? false : true;
      // this.salesDisableAllFields = (this.leadinfoDetails.PresalesAgentAssigned === this.loggedInuserDetails.EntityId || (this.loggedInuserDetails.TenantId === 0 && this.loggedInuserDetails['EngagementType'] === "Full Time") || this.loggedInuserDetails.Role === 1 || this.loggedInuserDetails.Role === 11) ? false : true;
    } else {
      this.disableAllFields = true;           // Disable all fields till if Enquiry is not selected
    }
    this.getAlternateNo();
    this.getCurrentTime();    // to check Current Time with Follow Up Time     
    if (this.leadinfoDetails.FollowUpStatus === 'Canceled') {
      this.clearFollowupForm();
    }
  }

  getProjectName = () => {
    //************ Show All Project Names in Create SiteVisit *************//
    this.projectNameSubscription = this.preSalesleadDetailsService.getAllProjectNames(this.loggedInuserDetails).subscribe((response) => {
      if (response && response['data']) {
        this.allProjectNames = response['data'];
      }
    })
  }

  callInteractionSubmit = (interactionModel, callForm) => {
    interactionModel.interactionType = interactionModel.offlineTime ? 'Offline Call Interaction' : 'Call Interaction';
    this.onInteractionSubmit(interactionModel, callForm)
  }

  onInteractionSubmit = (interactionModel, interactionForm) => {
    //************ Creating New Interaction *************//
    interactionModel.interactionType = 'Note' ? "Note" : "Call Interaction";
    if (interactionModel !== 0 || interactionModel !== null || interactionModel !== undefined) {
      this.interactionSubmitSubScription = this.preSalesleadDetailsService.insertInteractionStatus(this.loggedInuserDetails, interactionModel, this.EnquiryDetails).subscribe((response) => {
        if (response['successful']) {
          this.showSuccessBar("Interaction Inserted Successfully");
          this.sharedService.sharePresalesIneractionDetails(this.interactionDetails);
        } else {
          this.showFailedBar("Interaction Not Inserted Successfully");
        }
        this.interactionModel = {};
        if (interactionForm !== undefined) {
          interactionForm.form.markAsPristine();
          interactionForm.form.markAsUntouched();
        }
      });
    }
  }

  onDialCall = () => {
    this.CallPopUP.hide();
    //************ For Dial Call(Calling Functionality *************//
    if (this.from && this.To && this.from !== null) {
      this.disableCallBtn = true;                                                       //disable call button after first click for 15seconds
      this.messageService.add({ key: 'callNow', severity: 'warn', life: 25000 });       //for show toast Message for call button click.
      this.preSalesleadDetailsService.onCall(this.loggedInuserDetails, this.To, this.from, this.EnquiryDetails).subscribe((response) => {
        if (response) {
          this.messageService.add({ key: 'callDetails', severity: 'warn', life: 25000 });
        }
      });
      setTimeout(() => {
        this.disableCallBtn = false;
      }, 25000);
      this.openPopModel();
    }
    else {
      this.showFailedBar("Sorry Mobile No is not available");
    }
  }

  // ***** open Call Details Pop Up *****//
  openPopModel = () => {
    this.showCallPopup.emit(true);
  }

  getCurrentTime = () => {
    // ***** get Current Time *****//
    let today = new Date();
    this.currentdate = today.getFullYear() + '-' + ((today.getMonth() + 1) <= 9 ? '0' + (today.getMonth() + 1) : (today.getMonth() + 1)) + '-' + (today.getDate() <= 9 ? '0' + today.getDate() : today.getDate());
    // this.currentTime = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    let min: any = today.getMinutes();
    if (min < 10) {
      min = "0" + min;
    }
    let hour: any = today.getHours();
    if (hour < 10) {
      hour = "0" + hour;
    }
    this.currentTime = hour + ":" + min + ":" + today.getSeconds();
    if (this.leadinfoDetails.FollowUpDate && this.leadinfoDetails.FollowUpDate !== "") {
      if (this.currentdate === this.EnquiryDetails.FollowUpDate) {
        if (this.currentTime <= this.EnquiryDetails.FollowUpTime) {
          this.cancelFollowUpBtn = true;
        } else {
          this.clearFollowupForm();
        }
      } else {
        if (this.currentdate > this.EnquiryDetails.FollowUpDate) {
          this.clearFollowupForm();
        } else {
          this.cancelFollowUpBtn = true;
        }
      }
    } else {
      this.clearFollowupForm();
    }
  }

  // ***** Clear Follow Up Form ***** //
  clearFollowupForm = () => {
    this.cancelFollowUpBtn = false;
    this.leadinfoDetails.FollowUpDate = "";
    this.leadinfoDetails.FollowUpTime = "";
    this.leadinfoDetails.Agenda = "";
    this.selectedTime = "";
    this.leadinfoDetails.FollowUpStatus = "";
  }

  onFollowupCreate = (action, leadinfoDetails) => {
    //************ For Follow Up Creation *************//
    leadinfoDetails.FollowUpTime = this.selectedTime;
    if ((this.leadinfoDetails.FollowUpDate === this.currentdate && this.leadinfoDetails.FollowUpTime >= this.currentTime) || this.leadinfoDetails.FollowUpDate > this.currentdate) {
      this.disableFollowUpButton = true;
      leadinfoDetails.FollowUp = 'yes';
      leadinfoDetails.FollowUpStatus = (action === 'new') ? 'scheduled' : 'Canceled';
      leadinfoDetails.followUpType = 'Call';
      this.followupcreateSubscription = this.preSalesleadDetailsService.updateFollowUpStatus(this.loggedInuserDetails, leadinfoDetails, this.enquiryId).subscribe((response) => {
        if (response && response['successful']) {
          this.followupdatattest = response["data"];
          if (this.followupdatattest && this.followupdatattest.length > 0) {
            this.followupdatattestmodel.show();
          } else {
            this.followUpCancelModal.hide();
            this.showSuccessBar(action === 'new' ? 'FollowUp Inserted Successfully' : 'FollowUp Cancelled Successfully')
            this.sharedService.sharePresalesIneractionDetails(this.interactionDetails)   // followup with Interaction
            leadinfoDetails.FollowUpTime = '';
            this.updatedata.emit(this.EnquiryInfoDetails[0][0].EnquiryId);
            this.getCurrentTime();
          }
        } else {
          this.showFailedBar("FollowUp Not Inserted Successfully")
        }
        this.disableFollowUpButton = false;
      });

    } else {
      this.showFailedBar("You Cannot SetUp FollowUp for Past Time");
    }
    setTimeout(() => {
      this.checkTime = '';
    }, 5000);
  }

  replaceAll = (string, target, replacement) => {
    //************ Use Property To Replace All Target Characters *************//
    return string.split(target).join(replacement);
  };

  onSendMessage = (messageModel, messageForm, ProjectName) => {
    //************ For Message Send *************//
    this.EnquiryDetails.MobileNo = this.To;
    this.newTemplate = this.messageModel.Template;
    //************ To Replace ProjectName 'Common *************//
    if (ProjectName == 'Common') {
      ProjectName = '(Project Name)';
    }
    //************ To Replace Date *************//
    if (this.EnquiryDetails.PreferredDate !== null) {
      this.EnquiryDetails.PreferredDate = this.EnquiryDetails.PreferredDate.replace('T00:00:00', '');
    } else if (this.EnquiryDetails.PreferredDate == null) {
      this.EnquiryDetails.PreferredDate = '<date>';
    }
    //************ To Replace Time *************//
    if (this.EnquiryDetails.PreferredTime == null) {
      this.EnquiryDetails.PreferredTime = '<time>';
    }
    //************ To Replace Sales Name *************//
    if (this.EnquiryDetails.SalesAgentAssigned == null) {
      this.EnquiryDetails.SalesAgentAssigned = 'Sales Name';
    }
    //************ To Replace All Target Characters From SMS Template *************//
    this.messageModel.Template = this.replaceAll(this.replaceAll(this.replaceAll(this.replaceAll(this.replaceAll(this.replaceAll(this.replaceAll(this.replaceAll(this.replaceAll(this.replaceAll(this.replaceAll(this.newTemplate, '$project_name', ProjectName), '$lead_name', this.EnquiryDetails.FirstName), '$date', this.EnquiryDetails['PreferredDate']), '$lead_id', this.EnquiryDetails.EnquiryId), '$time', this.EnquiryDetails['PreferredTime']), '(date)', this.EnquiryDetails['PreferredDate']), '(time)', this.EnquiryDetails['PreferredTime']), '$ivr_number', '02248771317'), '$client_name', this.loggedInuserDetails.Firstname + ' ' + this.loggedInuserDetails.LastName), '$client_short_name', this.loggedInuserDetails.Firstname), '$sales_name', this.EnquiryDetails['SalesAgentAssigned']);
    //************ End *************//
    this.sendmessageSubscription = this.preSalesleadDetailsService.sendMessage(this.loggedInuserDetails, this.EnquiryDetails, messageModel, this.usertype).subscribe((response) => {
      if (response) {
        this.showSuccessBar(response);
        this.sharedService.sharePresalesIneractionDetails(this.interactionDetails);
      }
      this.clearMessageInput(messageForm);
    });
  }

  clearMessageInput = (messageForm) => {
    this.messageModel = {};
    messageForm.form.markAsPristine();
    messageForm.form.markAsUntouched();
    this.messageTemplate = '';
    this.ProjectName = '';
  }

  onSiteVisitCreate = (siteVisitModel, Action) => {
    this.isloading = true;
    //************ For Create New SiteVisit *************//
    if (this.sitevisitDetails && this.updateBtn) {
      siteVisitModel.interactionId = this.sitevisitDetails.InteractionId;
    }
    siteVisitModel.Action = Action;
    this.disableSiteVisitButton = true;
    siteVisitModel.time = this.selectSitevisitTime;
    this.insertSiteVisitSubscription = this.preSalesleadDetailsService.insertSiteVisit(this.loggedInuserDetails, this.EnquiryDetails, siteVisitModel).subscribe((response) => {
      if (response && response['successful']) {
        let Msg = "";
        switch (Action) {
          case 'INSERT':
            Msg = "SiteVisit Inserted Successfully";
            break;
          case 'UPDATE':
            Msg = "SiteVisit Updated Successfully";
            break;
          case 'CANCELED':
            this.SVCancelModal.hide();
            Msg = "SiteVisit Canceled Successfully"
            break;
        }
        this.showSuccessBar(Msg);
        this.sharedService.sharePresalesIneractionDetails(this.interactionDetails);
        this.updatedata.emit(this.EnquiryInfoDetails[0][0].EnquiryId);
      } else {
        this.showFailedBar("SiteVisit Not Inserted Successfully");
      }
      this.disableSiteVisitButton = false;
      this.updateBtn = true;
      this.isloading = false;
    })
  }

  createNewSitevisit = (createSiteVisitForm) => {
    //************ on New Sitevisit schedule clear all form *************//
    this.updateBtn = false;
    this.siteVisitModel = <IsiteVisitModel>{};
    this.siteVisitModel.PreferredProject = '';
    this.selectSitevisitTime = '';
    createSiteVisitForm.form.markAsUntouched();
    createSiteVisitForm.form.markAsPristine();
  }

  getAllSMSNameList = (ProjectName) => {
    //************ get all SMS name list for selected project *************//
    if (ProjectName && ProjectName !== '') {
      this.ContentType = 'sms';
      this.allSmsnameSubscription = this.preSalesleadDetailsService.getAllSmsNames(this.loggedInuserDetails, ProjectName, this.brochure, this.ContentType).subscribe((response) => {
        if (response && response['data']) {
          this.selectedTemplate = response['data'];
        }
      });
      this.dsbTemplate = true;
    } else {
      this.selectedTemplate = [];
      this.dsbTemplate = false;
    }
    this.messageModel.Template = null;
    this.messageTemplate = '';
  }

  onChooseMsgTemplate = (messageTemplate) => {
    //************ Message Template Selection *************//
    if (messageTemplate && messageTemplate !== "") {
      this.chooseTemplateSubscription = this.preSalesleadDetailsService.getSmsTemplate(messageTemplate).subscribe((response) => {
        if (response && response['data']) {
          this.messageModel.Template = response['data'][0].Content;
        }
      });
      this.dsbTemplate = true;
    } else {
      this.dsbTemplate = false;
      this.messageModel.Template = '';
    }
  }

  getAlternateNo = () => {
    //************ Select Alternate Mobile No. To Call *************//
    if (this.leadinfoDetails.AlternateNo !== undefined && this.leadinfoDetails.AlternateNo !== null)
      this.alternateNo = this.leadinfoDetails.AlternateNo.split(',');
  }

  onChangeCountryForAlternateNo = (select) => {
    if (select && select.value && select.value != '') {
      //************ Add country code while call on Alernate Mobile No *************//
      if (this.EnquiryDetails['AlternateNo']) {
        this.from = this.loggedInuserDetails.MobileNo;
        this.To = select.value.trim();
      }
    } else {
      this.To = this.EnquiryDetails.MobileNo;
    }
  }

  receiveData = ($event) => {
    // ************* for receive id from Search ************//
    this.disableMergeButton = false;
    this.id = $event.EnquiryId;
    this.getEnquiryDetails();
    this.disableAllFields = false;
    if (this.id != null) {
      // || this.id != ''
      this.disableMergeButton = true;
    }
  }

  getEnquiryDetails = () => {
    //************ Get Enquiry Details By Id *************//
    this.enquiryDetailsSubscription = this.preSalesleadDetailsService.getByEnquiryLead(this.loggedInuserDetails, this.id).subscribe((response) => {
      if (response && response['data']) {
        this.leadinfoDetails = response['data'][0][0];
      }
    });
  }

  leadToBeDeleted = (EnquiryDetails) => {
    //************ Merge Lead To Be Deleted *************//
    this.leadDeletedSubscription = this.preSalesleadDetailsService.mergeLeadToBeDeleted(this.loggedInuserDetails, this.id, EnquiryDetails).subscribe((response) => {
      if (response == 'Enquiry successfully merged') {
        this.showSuccessBar(response);
        this.disableMergeButton = false;
      } else if (response == 'Enquiry not successfully merged') {
        this.showFailedBar(response);
      }
    });
    //************ End *************//
  }
  open = () => {
    //************ open Time Click *************//
    const amazingTimePicker = this.atp.open({});
    amazingTimePicker.afterClose().subscribe(time => {
      this.selectedTime = time;
    });
  }

  openClock = () => {
    //************ open Time Click *************//
    const amazingTimePicker = this.atp.open({});
    amazingTimePicker.afterClose().subscribe(time => {
      this.selectSitevisitTime = time;
    });
  }

  getToday(): string {
    //************ can not select future date *************//
    return new Date().toISOString().split('T')[0];
  }

  trackByFn(item) {
    return item.id; // unique id corresponding to the item
  }

  onReject() {
    //************ hide the Toast after click on Close Button *************//
    this.messageService.clear('c');
  }

  enterOfflineDetails = (offlineDetails) => {
    //************ Enter Offline Call Details  *************//
    if (offlineDetails.offlineTime) {
      offlineDetails.duration = offlineDetails.offlineTime * 60;
      offlineDetails.status = offlineDetails.callStatus ? offlineDetails.callStatus : null;
      offlineDetails.direction = 'outbound-api';
      this.preSalesleadDetailsService.offlineCallDetails(this.loggedInuserDetails, this.EnquiryDetails, offlineDetails)
        .subscribe((response) => {
          if (response === null) {
            this.showSuccessBar("Offline Call Details Successfully Insert");
          } else {
            this.showFailedBar("Offline Call Details Failed to Insert");
          }
        });
    }
  }
  //** Action for open Pop Up For SV Cancel */
  openPopUpForSVCancel(siteVisitModel) {
    this.siteVisitModel = siteVisitModel;
    this.SVCancelModal.show();
  }
  openPopUpForCall(){
    this.CallPopUP.show();
  }
  showFailedBar = (message) => {
    this.snackBar.open(message, null, { duration: 5000, panelClass: ['red-snackbar'] });
  }
  showSuccessBar = (message) => {
    this.snackBar.open(message, null, { duration: 5000, panelClass: ['blue-snackbar'] });
  }
  onClose = () => {
    //************* onClose Model **************//
    this.followupdatattestmodel.hide();
    this.CallPopUP.hide();
    //************* End **************//
  }

  ngOnDestroy() {
    this.projectNameSubscription ? this.projectNameSubscription.unsubscribe() : null;
    this.leadDeletedSubscription ? this.leadDeletedSubscription.unsubscribe() : null;
    this.enquiryDetailsSubscription ? this.enquiryDetailsSubscription.unsubscribe() : null;
    this.chooseTemplateSubscription ? this.chooseTemplateSubscription.unsubscribe() : null;
    this.allSmsnameSubscription ? this.allSmsnameSubscription.unsubscribe() : null;
    this.insertSiteVisitSubscription ? this.insertSiteVisitSubscription.unsubscribe() : null;
    this.sendmessageSubscription ? this.sendmessageSubscription.unsubscribe() : null;
    this.followupcreateSubscription ? this.followupcreateSubscription.unsubscribe() : null;
    this.interactionSubmitSubScription ? this.interactionSubmitSubScription.unsubscribe() : null;
  }
}