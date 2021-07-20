import { Component, OnInit, Input, SimpleChanges, OnDestroy, Output, EventEmitter, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AmazingTimePickerService } from 'amazing-time-picker';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs'
import { ModalDirective } from 'ngx-bootstrap';
import { SalesLeadDetailsService } from 'src/app/shared/services/employee/sales-lead-details.service';
import { SharedService } from 'src/app/shared/services/shared/shared.service';
import { MatSnackBar } from '@angular/material';
import { IloggedInuserDetails } from 'src/app/shared/models/Authentication/loggedInuserDetails.model';
import { Iemailmodel, IleadinfoDetails, ImessageModel, IsiteVisitModel, IinteractionModel } from 'src/app/shared/models/employeeModel/opportunity-details.model';
@Component({
  selector: 'tru-create-sales-interaction',
  templateUrl: './create-sales-interaction.component.html',
  styleUrls: ['./create-sales-interaction.component.scss'],
  providers: [MessageService]
})
export class CreateSalesInteractionComponent implements OnInit, OnDestroy {
  public selectedTemplate: string[] = [];
  public To: number;
  public CC: string;
  public loggedInuserDetails: IloggedInuserDetails = <IloggedInuserDetails>{};
  public emailmodel: Iemailmodel = <Iemailmodel>{};
  public leadinfoDetails: IleadinfoDetails = <IleadinfoDetails>{};
  public interactionModel: IinteractionModel = <IinteractionModel>{};
  public selectedTime: string;
  public empName: string;
  public messageModel: ImessageModel = <ImessageModel>{};
  public messageTemplate: string;
  public allProjectNames: string;
  public siteVisitModel: IsiteVisitModel = <IsiteVisitModel>{};
  public selectSitevisitTime: string;
  public id: number;
  public from: number;
  public disableAllFields: boolean = false;
  public CountryCode: string = "+91";
  public SiteVisitStatus = "Site Visit Scheduled";
  public statusDetails: string;
  public ProjectName: string;
  public ContentType: string;
  public brochure: string;
  public newTemplate: string;
  public alternateNo: string[] = [];
  public CountryCodes: string;
  public disableCallBtn: boolean = false;
  public dsbTemplate: boolean = false;
  public disableonLogin: boolean = false;
  public cancelFollowUpBtn: boolean = false;
  public disableFollowUpButton: boolean;
  public checkTime: string = '';
  public currentdate: string;
  public currentTime: string;
  private _EventSubscription: Array<Subscription> = [];
  public p1=1;
  @Input() leadDetails: any;
  @Input() checkStatus: any;
  @Output() updatedata = new EventEmitter<any>();
  @ViewChild('followupdatattestmodel', { static: false }) public followupdatattestmodel: ModalDirective;
  public followupdatattest: object[] = [];
  @ViewChild('followUpCancelModal', { static: false }) public followUpCancelModal: ModalDirective;
  @Output() showCallPopup = new EventEmitter<boolean>();
  @ViewChild('CallPopUP', { static: false }) public CallPopUP: ModalDirective;

  constructor(private salesLeadDetailsService: SalesLeadDetailsService,
    private sharedService: SharedService,
    private atp: AmazingTimePickerService,
    public router: Router,
    private messageService: MessageService,
    private snackBar: MatSnackBar) { }

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
    if (changes.leadDetails && this.leadDetails && this.leadDetails.ReferralId && changes.leadDetails.previousValue !== undefined || changes.checkStatus || this.checkStatus) {
      this.loggedInuserDetails = JSON.parse(localStorage.getItem('LoggedinUser'));
      this.disableAllFields = this.checkStatus === 'Assigned to Presales' ? true : false;
      this.leadDetails.ReferralId ? this.getReferralDetails() : null;
    } else {
      this.disableAllFields = true;
    }
    this.getCurrentTime();    // to check Current Time with Follow Up Time 
    if (this.leadinfoDetails.FollowUpStatus === 'Canceled') {
      this.clearFollowupForm();
    }
  }

  getReferralDetails = () => {
    this.id = this.leadDetails.ReferralId;
    this.To = this.leadDetails.MobileNo;
    this.leadinfoDetails.FollowUpDate = this.leadDetails.FollowUpDate;
    this.selectedTime = this.leadDetails.FollowUPTime;
    this.leadinfoDetails.FollowUp = this.leadDetails.FollowUp;
    this.leadinfoDetails.FollowUpStatus = this.leadDetails.FollowUpStatus;
    this.leadinfoDetails.Agenda = this.leadDetails.FollowUpDetails;
    this.emailmodel.Email = this.leadDetails.ReferralEmail;
    this.emailmodel.UserType = this.leadDetails.UserType;
    this.emailmodel.EnquiryId = this.leadDetails.ReferralId;
    this.emailmodel.AlternateEmail = this.leadDetails.AlternateEmail;
    this.leadinfoDetails.FollowUpType = this.leadDetails.FollowUpType;
    this.leadinfoDetails.FollowUpStatus = this.leadDetails.FollowUpStatus;
    this.leadinfoDetails.AlternateNo = this.leadDetails.AlternateNo;
    this.interactionModel.followUp = "";
    this.leadinfoDetails.followUpType = "";
    // this.disableonLogin = (this.loggedInuserDetails.EntityId === this.leadDetails.SalesAgentAssignedId || this.loggedInuserDetails.Role === 1) ? false : true;
    if (this.leadDetails.IsReferralActive === false) {
      this.disableonLogin = this.loggedInuserDetails['EngagementType'] ? ((this.loggedInuserDetails['TenantId'] === 0 && this.loggedInuserDetails['EngagementType'] === "Full Time")) ? false : true : true;
    } else {
      this.disableonLogin = ((this.loggedInuserDetails['TenantId'] === 0 && (this.loggedInuserDetails['EngagementType'] ? this.loggedInuserDetails['EngagementType'] === "Full Time" : true)) || this.loggedInuserDetails.EntityId === this.leadDetails.SalesAgentAssignedId || this.loggedInuserDetails.Role === 1) ? false : true;
    }
    this.getAlternateNo();
  }

  getProjectName = () => {
    //------- Show All Project Names in Create SiteVisit -------//
    const GetSelectedProject = this.salesLeadDetailsService.GetSelectedProject(this.loggedInuserDetails).subscribe((response) => {
      if (response && response["data"]) {
        this.allProjectNames = response["data"];
      }
    })
    this._EventSubscription.push(GetSelectedProject);
  }

  onInteractionSubmit = (interactionModel, interactionForm) => {
    //------- Creating New Interaction -------//
    const insertInteractionStatusSubscription = this.salesLeadDetailsService.insertInteractionStatus(this.loggedInuserDetails, interactionModel, this.leadDetails).subscribe((response) => {
      if (response['successful']) {
        this.interactionModel = <IinteractionModel>{};
        this.showSuccessBar("Interaction Inserted Successfully");
        // this.showInteractionSuccessMessage = "Interaction Inserted Successfully";
        this.sharedService.changeSalesIneractionDetails();
      } else {
        this.showFailedBar("Interaction Insertion Failed");
        // this.showInteractionUnSuccessMessage = "Interaction Not Inserted Successfully";
      }
      this.interactionModel.followUp = "";
      if (interactionForm != undefined) {
        interactionForm.form.markAsPristine();
        interactionForm.form.markAsUntouched();
      }
    });
    this._EventSubscription.push(insertInteractionStatusSubscription);
  }
  // ***** emit popup to another component *****//
  openPopModel = () => {
    this.showCallPopup.emit(true);
  }

  getCurrentTime = () => {
    // ***** get Current Time *****//
    let today = new Date();
    this.currentdate = today.getFullYear() + '-' + ((today.getMonth() + 1) <= 9 ? '0' + (today.getMonth() + 1) : (today.getMonth() + 1)) + '-' + (today.getDate() <= 9 ? '0' + today.getDate() : today.getDate());
    this.currentTime = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    if (this.leadinfoDetails.FollowUpDate && this.leadinfoDetails.FollowUpDate !== null) {
      if (this.currentdate === this.leadDetails.FollowUpDate) {
        if (this.currentTime <= this.leadDetails.FollowUPTime) {
          this.cancelFollowUpBtn = true;
        } else {
          this.clearFollowupForm();
        }
      } else {
        if (this.currentdate > this.leadDetails.FollowUpDate) {
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
    // this.disableOncancel = false
    this.leadinfoDetails.FollowUpDate = "";
    this.leadinfoDetails.FollowUPTime = "";
    this.leadinfoDetails.Agenda = "";
    this.selectedTime = "";
    this.leadinfoDetails.FollowUpStatus = "";
  }
  onFollowupCreate = (action, leadinfoDetails) => {
    //------- For Follow Up Creation -------//
    leadinfoDetails.FollowUPTime = this.selectedTime;
    if (leadinfoDetails.FollowUPTime === "") {
      this.showFailedBar('Please enter follow up Time');
    } else {
      if ((this.leadinfoDetails.FollowUpDate === this.currentdate && this.leadinfoDetails.FollowUPTime >= this.currentTime) || this.leadinfoDetails.FollowUpDate > this.currentdate) {
        this.disableFollowUpButton = true;
        leadinfoDetails.FollowUp = 'yes';
        leadinfoDetails.FollowUpStatus = (action === 'new') ? 'scheduled' : 'Canceled';
        leadinfoDetails.followUpType = 'Call';
        const updateFollowUpStatusSubscription = this.salesLeadDetailsService.updateFollowUpStatus(this.loggedInuserDetails, leadinfoDetails, this.id).subscribe((response) => {
          if (response && response['successful']) {
            this.followupdatattest = response["data"];
            if (this.followupdatattest && this.followupdatattest.length > 0) {
              this.followupdatattestmodel.show();
            } else {
              this.showSuccessBar(action === 'new' ? 'FollowUp Inserted Successfully' : 'FollowUp Cancelled Successfully');
              this.followUpCancelModal.hide();
              this.sharedService.changeSalesIneractionDetails();
              this.updatedata.emit(this.leadDetails.ReferralId);
            }
          } else {
            this.showFailedBar("FollowUp Not Inserted Successfully")
          }
        });
        this._EventSubscription.push(updateFollowUpStatusSubscription);
      } else {
        this.showSnackBar("You Cannot SetUp FollowUp for Past Time");
      }
    }
    setTimeout(() => {
      this.checkTime = '';
    }, 5000);
  }

  onClose = () => {
    //************* onClose Model **************//
    this.followupdatattestmodel.hide();
    //************* End **************//
  }
  replaceAll = (string, target, replacement) => {
    //---------Use Property To Replace All Target Characters------//
    return string.split(target).join(replacement);
  };

  onSendMessage = (messageModel, messageForm, ProjectName) => {
    //-------For Message Send-------//
    this.leadDetails.MobileNo = this.To;
    this.newTemplate = this.messageModel.Template;
    //---------To Replace ProjectName 'Common'------//
    if (ProjectName == 'Common') {
      ProjectName = '(Project Name)';
    }
    //---------To Replace Date------//
    if (this.leadDetails.PreferredDate !== null) {
      this.leadDetails.PreferredDate = this.leadDetails.PreferredDate.replace('T00:00:00', '');
    } else if (this.leadDetails.PreferredDate == null) {
      this.leadDetails.PreferredDate = '<date>';
    }
    //---------To Replace Time------//
    if (this.leadDetails.PreferredTime == null) {
      this.leadDetails.PreferredTime = '<time>';
    }
    //---------To Replace Sales Name------//
    if (this.leadDetails.SalesAgentAssigned == null) {
      this.leadDetails.SalesAgentAssigned = 'Sales Name';
    }
    //---------To Replace All Target Characters From SMS Template------//
    this.messageModel.Template = this.replaceAll(this.replaceAll(this.replaceAll(this.replaceAll(this.replaceAll(this.replaceAll(this.replaceAll(this.replaceAll(this.replaceAll(this.replaceAll(this.replaceAll(this.newTemplate, '$project_name', ProjectName), '$lead_name', this.leadDetails.Name), '$date', this.leadDetails.PreferredDate), '$lead_id', this.leadDetails.ReferralId), '$time', this.leadDetails.PreferredTime), '(date)', this.leadDetails.PreferredDate), '(time)', this.leadDetails.PreferredTime), '$ivr_number', '02248771317'), '$client_name', this.loggedInuserDetails.Firstname + ' ' + this.loggedInuserDetails.LastName), '$client_short_name', this.loggedInuserDetails.Firstname), '$sales_name', this.leadDetails.SalesAgentAssigned);
    const sendMessageSubscription = this.salesLeadDetailsService.sendMessage(this.loggedInuserDetails, this.leadDetails, messageModel).subscribe((response) => {
      if (response) {
        this.showSuccessBar(response);
        //  this.showSendMessageSuccessMessage = response;
        this.sharedService.changeSalesIneractionDetails();
      }
      this.clearMessageInput(messageForm);
    });
    this._EventSubscription.push(sendMessageSubscription);
  }

  clearMessageInput = (messageForm) => {
    this.messageModel = <ImessageModel>{};
    messageForm.form.markAsPristine();
    messageForm.form.markAsUntouched();
    this.messageTemplate = "";
    this.ProjectName = "";
  }

  onSiteVisitCreate = (siteVisitModel, createSiteVisitForm) => {
    //-------For Create New SiteVisit-------//
    siteVisitModel.time = this.selectSitevisitTime;
    this.statusDetails = `${this.leadDetails.ReferralStatus}#**#${this.SiteVisitStatus}`;
    this.leadDetails.ReferralStatus = this.statusDetails;
    const createSiteVisitSubscription = this.salesLeadDetailsService.createSiteVisit(this.loggedInuserDetails, this.leadDetails, siteVisitModel).subscribe((response) => {
      if (response['successful']) {
        this.showSuccessBar("SiteVisit Inserted Successfully");
        // this.showSiteVisitCreateSuccessMessage = "";
        this.sharedService.changeSalesIneractionDetails();
      } else {
        this.showFailedBar("SiteVisit Not Inserted Successfully");
        // this.showSiteVisitCreateUnSuccessMessage = "SiteVisit Not Inserted Successfully";
      }
      this.clearSiteVisitInput(createSiteVisitForm);
    });
    this._EventSubscription.push(createSiteVisitSubscription);
  }

  clearSiteVisitInput = (createSiteVisitForm) => {
    this.siteVisitModel = <IsiteVisitModel>{};
    this.selectSitevisitTime = "";
    this.siteVisitModel.PreferredProject = "";
    createSiteVisitForm.form.markAsPristine();
    createSiteVisitForm.form.markAsUntouched();
  }

  open = () => {
    //------- open Time Click -------//
    const amazingTimePicker = this.atp.open({});
    amazingTimePicker.afterClose().subscribe(time => {
      this.selectedTime = time;
    });
  }

  openClock = () => {
    //------- open Time Click -------//
    const amazingTimePicker = this.atp.open({});
    amazingTimePicker.afterClose().subscribe(time => {
      this.selectSitevisitTime = time;
    });
  }

  getToday(): string {
    //------- can not select future date -------//
    return new Date().toISOString().split('T')[0];
  }

  getAllSMSNameList = (ProjectName) => {
    //-------get all SMS name list for selected project-------//
    if (ProjectName && ProjectName !== '') {
      this.ContentType = 'sms';
      const getAllSmsNamesSubscription = this.salesLeadDetailsService.getAllSmsNames(this.loggedInuserDetails, ProjectName, this.brochure, this.ContentType).subscribe((response) => {
        if (response && response["data"]) {
          this.selectedTemplate = response['data'] ? response['data'] : [];
        }
      });
      this._EventSubscription.push(getAllSmsNamesSubscription);
      this.dsbTemplate = true;
    } else {
      this.selectedTemplate = [];
      this.dsbTemplate = false;
    }
    this.messageModel.Template = null;
    this.messageTemplate = '';
  }

  onChooseMsgTemplate = (messageTemplate) => {
    //-------Message Template Selection-------//
    if (messageTemplate && messageTemplate !== '') {
      const getAllSmsNamesSubscription = this.salesLeadDetailsService.getSmsTemplate(messageTemplate).subscribe((response) => {
        if (response && response['data']) {
          this.messageModel.Template = (response['data'][0] && response['data'][0].Content) ? response['data'][0].Content : '';
        }
      });
      this._EventSubscription.push(getAllSmsNamesSubscription);
      this.dsbTemplate = true;
    } else {
      this.dsbTemplate = false;
      this.messageModel.Template = '';
    }
  }

  onDialCall = () => {
    this.CallPopUP.hide();
    if (this.from && this.To && this.from !== null) {
      //------- For Dial Call(Calling Functionality) -------//
      this.disableCallBtn = true;                                          //disable call button after first click for 10seconds
      this.messageService.add({ key: 'callNow', severity: 'warn', life: 10000 });       //for show toast Message for call button click.
      const onCallSubscription = this.salesLeadDetailsService.onCall(this.loggedInuserDetails, this.To, this.from, this.leadDetails).subscribe((response) => {
        if (response) {
          this.messageService.add({ key: 'callDetails', severity: 'warn', life: 25000 });
        }
      });
      this._EventSubscription.push(onCallSubscription);
      setTimeout(() => {
        this.disableCallBtn = false;
      }, 10000);
      this.openPopModel();
    } else {
      this.showFailedBar("Sorry mobile No is not available");
    }
  }
  receiveData = ($event) => {
    // //------- for receive id from Search -------//
    this.leadDetails['ReferralMergeId'] = $event.ReferralId;
    this.leadDetails['LeadMergeMobileNo'] = $event.MobileNo;
    this.leadDetails['LeadMergeFirstName'] = $event.FirstName ? $event.FirstName : $event.Name;
    this.leadDetails['LeadMergeLastName'] = $event.LastName;
    this.disableAllFields = ($event.SalesAgentAssignedId === this.loggedInuserDetails['EntityId'] || this.loggedInuserDetails.Role === 1) ? false : true;
    this.disableAllFields = $event.IsActive === 1 ? false : true;
    //------- End -------//
  }
  getAlternateNo = () => {
    //************ Select Alternate Mobile No. To Call *************//
    if (this.leadinfoDetails.AlternateNo !== undefined && this.leadinfoDetails.AlternateNo !== null)
      this.alternateNo = this.leadinfoDetails.AlternateNo.split(',');
  }
  leadToBeDeleted = (LeadDetails) => {
    //************ Merge Lead To Be Deleted *************//
    let leadDeletedSubscription = this.salesLeadDetailsService.mergeLeadToBeDeleted(this.loggedInuserDetails, LeadDetails).subscribe((response) => {
      if (response == 'Lead successfully merged') {
        this.showSuccessBar(response);
      }
    });
    this._EventSubscription.push(leadDeletedSubscription);
    //************ End *************//
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

  showFailedBar = (message: string) => {
    this.snackBar.open(message, null, { duration: 5000, panelClass: ['red-snackbar'] });
  }
  showSuccessBar = (message) => {
    this.snackBar.open(message, null, { duration: 5000, panelClass: ['blue-snackbar'] });
  }
  //********** show snackbar for message **********//
  showSnackBar = (message: string) => {
    this.snackBar.open(message, 'Close', { duration: 5000 });
  }

  trackByFn(item) {
    return item.id; // unique id corresponding to the item
  }

  ngOnDestroy = () => {
    //-------destroy service Subscription-------//
    for (let item of this._EventSubscription) {
      item.unsubscribe();
    }
  }
}