import { Component, Input, SimpleChanges, OnChanges, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { AmazingTimePickerService } from 'amazing-time-picker';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CpDetailsService } from 'src/app/shared/services/employee/cp-details.service';
import { PaymentWalletService } from 'src/app/shared/services/channelPartner/payment-wallet.service';
import { ModalDirective } from 'ngx-bootstrap';
import { IloggedInuserDetails } from 'src/app/shared/models/Authentication/loggedInuserDetails.model';
import { IcpDetail, IfollowUpDetails, ImessageModel } from 'src/app/shared/models/employeeModel/power-sales-dashboard.model';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'tru-cp-details',
  templateUrl: './cp-details.component.html',
  styleUrls: ['./cp-details.component.scss']
})
export class CpDetailsComponent implements OnInit, OnChanges, OnDestroy {
  transferHistoryDetails: boolean;
  @ViewChild('BrokarageDetailsModal', { static: false }) public BrokarageDetailsModal: ModalDirective;
  public title: string;
  public actualBrokarageList: string[] = [];
  public predictedBrokarageList: string[] = [];
  public predictAmount: number;
  public actualAmount: number;
  public BrokarageList: string[] = [];
  public BrokarageDetails = [];
  public followUpTypes: any = [
    { key: "Call", value: "Call" },
    { key: "Email", value: "Email" }];
  public followUpStatus: any = [
    { key: "scheduled", value: "Schedule" },
    { key: "done", value: "Done" }];
  @Input() id: any = [];
  public loggedInuserDetails: IloggedInuserDetails = <IloggedInuserDetails>{};
  public cpDetails: IcpDetail = <IcpDetail>{};
  public To: number;
  public from: number;
  public messageModel: ImessageModel = <ImessageModel>{};
  public followUpDetails: IfollowUpDetails = <IfollowUpDetails>{};
  public selectedTime: string;
  public smsDetails: string[] = [];
  public interactionData: string[] = [];
  public callDetails: string[] = [];
  public disableAllFields: boolean = false;
  public currentIndexNo: number;
  public cpId: string;
  public p1: number;
  public p3: number;
  public indexLength: number;
  public allCpCroId: string[] = [];
  public selectedIdUserType: string;
  public smsDetailSubscription: Subscription;
  public callDetailSubscription: Subscription;
  public getInteractionSubscription: Subscription;
  public sendMessageSubscription: Subscription;
  public interactionSubscription: Subscription;
  public DialCallSubscription: Subscription;
  public cpDetailSubscription: Subscription;

  constructor(
    private cpDetailsService: CpDetailsService,
    public router: Router,
    private paymentWalletService: PaymentWalletService,
    private atp: AmazingTimePickerService,
    private snackBar: MatSnackBar) { }
  ngOnInit() {
    this.loggedInuserDetails = JSON.parse(localStorage.getItem('LoggedinUser'));

    this.from = this.loggedInuserDetails.MobileNo;
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes.id && this.id || this.id != undefined) {
      let selectedId = changes.id.currentValue.id;
      this.allCpCroId = changes.id.currentValue.allCpCroId;
      if (this.allCpCroId && this.allCpCroId !== undefined) {
        this.indexLength = this.allCpCroId.length - 1;
        this.selectedIdUserType = selectedId.UserType;
        this.currentIndexNo = this.allCpCroId.indexOf(this.selectedIdUserType === "CRO" ? changes.id.currentValue.id.CroId : changes.id.currentValue.id.CPId);
      }
      this.getCpDetails(selectedId);
      this.disableAllFields = false;
      this.followUpDetails.FollowUpStatus = "";
      this.followUpDetails.followUpType = "";
    } else {
      this.disableAllFields = true;
    }
  }
  // ********* Show All Brokarage Details *********** //
  actualBrokarage = () => {
    this.paymentWalletService.actualBrokarage(this.cpDetails).subscribe((response) => {
      if (response && response['data']) {
        this.predictedBrokarageList = response['data'][0] ? response['data'][0] : null;
        this.predictAmount = response['data'][1][0]['PredictedAmount'] ? response['data'][1][0]['PredictedAmount'] : null;
        this.actualAmount = response['data'][2][0]['ActualAmount'] ? response['data'][2][0]['ActualAmount'] : null;
        this.actualBrokarageList = response['data'][3] ? response['data'][3] : null;
      }
    });
  }
  // ******* show Brokarage Information modal Pop ******* //
  brokarageList = (input) => {
    this.BrokarageDetailsModal.show();
    //this.transferHistoryDetails = false;
    switch (input) {
      case 'predict':
        this.BrokarageList = this.predictedBrokarageList;
        this.title = "Predict Earning Details";
        break;
      case 'actual':
        this.BrokarageList = this.actualBrokarageList;
        this.title = "Actual Earning Details";
        break;
    }
  }
  getCpDetails = (id) => {
    let selectedId = id;
    this.cpDetailSubscription = this.cpDetailsService.GetChannelPartnerDetails(id).subscribe((response) => {
      if (response && response['data'] && response['data'][0]) {
        this.cpDetails = response['data'][0][0];
        this.To = this.cpDetails.MobileNo;
        this.actualBrokarage();
      }
    });
    this.getInteraction(selectedId);
    this.showCallDetails(selectedId);
    this.showSmsDetails(selectedId);
  }
  preSelectedId = () => {
    //************* get previous Cp/Cro id and get details of that id **************//
    if (this.currentIndexNo != -1) {
      this.currentIndexNo -= 1;
      if (this.currentIndexNo > -1) {
        this.cpId = this.allCpCroId[this.currentIndexNo];
      } else {
        this.currentIndexNo = this.indexLength;
        this.cpId = this.allCpCroId && this.allCpCroId[this.currentIndexNo];
      }
      let selectedId = [];
      selectedId['EntityId'] = this.cpId;
      selectedId['UserType'] = this.selectedIdUserType;
      this.getCpDetails(selectedId);
    }
    //************* end **************//
  }
  nextSelectedId = () => {
    //************* get next Cp/Cro id and get details of that id **************//
    if (this.currentIndexNo != -1) {
      this.currentIndexNo += 1;
      if (this.currentIndexNo <= this.indexLength) {
        this.cpId = this.allCpCroId[this.currentIndexNo];
      } else {
        this.currentIndexNo = 0;
        this.cpId = this.allCpCroId && this.allCpCroId[this.currentIndexNo];
      }
      let selectedId = [];
      selectedId['EntityId'] = this.cpId;
      selectedId['UserType'] = this.selectedIdUserType;
      this.getCpDetails(selectedId);
    }
    //************* end **************//
  }
  onDialCall = () => {
    if (this.from && this.To && this.from !== null) {
      //-------For Dial Call(Calling Functionality)-------//
      this.DialCallSubscription = this.cpDetailsService.onCall(this.loggedInuserDetails, this.To, this.from).subscribe((response) => {
        if (response) { }
      });
      //-------End-------//
    } else {
      this.showFailedBar("Sorry mobile No is not available");
    }
  }
  open = () => {
    //-------open Time Click-------//
    const amazingTimePicker = this.atp.open({});
    amazingTimePicker.afterClose().subscribe(time => {
      this.selectedTime = time;
    });
    //-------End-------//
  }
  getToday(): string {
    //-------can not select future date-------//
    return new Date().toISOString().split('T')[0];
    //-------End-------//
  }
  onInteractionSubmit = (followUpDetails, interactionForm) => {
    //-------Creating New Interaction-------//
    this.cpDetails['EntityId'] = this.selectedIdUserType === "CRO" ? this.cpDetails['CROId'] : this.cpDetails['BrokerId'];
    followUpDetails.FollowUpTime = this.selectedTime;
    if (followUpDetails !== 0 || followUpDetails !== null || followUpDetails !== undefined) {
      this.interactionSubscription = this.cpDetailsService.insertInteractionStatus(this.loggedInuserDetails, followUpDetails, this.cpDetails).subscribe((response) => {
        if (response && response['successful']) {
          this.showSuccessBar("Interaction Inserted Successfully");
        } else {
          this.showFailedBar("Interaction Not Inserted Successfully");
        }
        this.followUpDetails = <IfollowUpDetails>{};
        interactionForm.form.markAsPristine();
        interactionForm.form.markAsUntouched();
        this.followUpDetails.followUp = "";
        this.selectedTime = "";
        this.getInteraction(this.cpDetails);
      });
    }
    //-------End-------//
  }
  onSendMessage = (messageModel, messageForm) => {
    //-------For Message Send-------//
    this.cpDetails['EntityId'] = this.selectedIdUserType === "CRO" ? this.cpDetails['CroId'] : this.cpDetails['BrokerId'];
    this.cpDetails.MobileNo = this.To;
    this.sendMessageSubscription = this.cpDetailsService.sendMessage(this.loggedInuserDetails, this.cpDetails, messageModel).subscribe((response) => {
      if (response) {
        this.showSuccessBar(response as string);
        this.showSmsDetails(this.cpDetails);
      }

      this.clearMessageInput(messageForm);
    });
    //-------End-------//
  }
  clearMessageInput = (messageForm) => {
    this.messageModel = <ImessageModel>{};
    messageForm.form.markAsPristine();
    messageForm.form.markAsUntouched();
  }
  getInteraction = (id) => {
    //-------show All Interaction Details-------//
    this.getInteractionSubscription = this.cpDetailsService.getInteractionDetails(id).subscribe((response) => {
      if (response && response["data"]) {
        this.interactionData = response["data"];
      }
    });
    //-------End-------//
  }
  showCallDetails = (id) => {
    //-------show Call Details -------//
    this.callDetailSubscription = this.cpDetailsService.getCallDetails(this.loggedInuserDetails, id).subscribe((response) => {
      if (response && response["data"]) {
        this.callDetails = response["data"];
      }
    });
  }
  showSmsDetails = (id) => {
    //-------show Sms Details-------//
    this.smsDetailSubscription = this.cpDetailsService.getSmsDetails(this.loggedInuserDetails, id).subscribe((response) => {
      if (response && response["data"]) {
        this.smsDetails = response["data"];
      }
    });
  }
  // unique id corresponding to the item
  trackByFn(item) {
    return item.id;
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
    this.smsDetailSubscription ? this.smsDetailSubscription.unsubscribe() : null;
    this.callDetailSubscription ? this.callDetailSubscription.unsubscribe() : null;
    this.getInteractionSubscription ? this.getInteractionSubscription.unsubscribe() : null;
    this.sendMessageSubscription ? this.sendMessageSubscription.unsubscribe() : null;
    this.interactionSubscription ? this.interactionSubscription.unsubscribe() : null;
    this.DialCallSubscription ? this.DialCallSubscription.unsubscribe() : null;
    this.cpDetailSubscription ? this.cpDetailSubscription.unsubscribe() : null;
  }
}