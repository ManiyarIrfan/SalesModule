import { Component, OnInit, ViewChild, Input, SimpleChanges, OnDestroy, OnChanges, Output, EventEmitter } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { MatSnackBar } from '@angular/material';
import { Subscription } from 'rxjs';
import { PaymentWalletService } from 'src/app/shared/services/channelPartner/payment-wallet.service';
@Component({
  selector: 'app-pay-wallet',
  templateUrl: './pay-wallet.component.html',
  styleUrls: ['./pay-wallet.component.scss'],
})
export class PayWalletComponent implements OnInit, OnDestroy, OnChanges {
  @ViewChild('BrokarageDetailsModal', { static: false }) public BrokarageDetailsModal: ModalDirective;
  @ViewChild('confirmationModal', { static: false }) public confirmationModal: ModalDirective;
  @Input() channelPartnerModel: any;
  @Output() reloadEvent = new EventEmitter<string>();

  public actualBrokarageList: string[] = [];
  public predictedBrokarageList: string[] = [];
  public predictAmount: number;
  public actualAmount: number;
  public loggedInuserDetails: any = {};
  public showpaymentFields: boolean = false;
  public wrongAmtMsg: boolean = false;
  public transferHistory: string[] = [];
  public transferHistoryDetails: boolean = false;
  public p3: number;
  public incorrectAgreementNo: boolean;
  public title: string;
  public BrokarageList: string[] = [];
  public disabletransferBtn: boolean = false;
  public totalPayedAmt: number;

  public actualBrokarageSubscription: Subscription;
  public checkAgreementnumberSubscription: Subscription;
  public viewTransferHistorySubscription: Subscription;
  public createRazorpayfundAccSubscription: Subscription;
  public createRazorpayAccSubscription: Subscription;
  public payoutSubscription: Subscription;
  public payAccountSummerySubscription: Subscription;
  public bankDetailsonFunAccSubscription: Subscription;

  constructor(private paymentWalletService: PaymentWalletService,
    private snackBar: MatSnackBar) { }

  ngOnInit() {
    if (localStorage.getItem('LoggedinUser')) {
      this.loggedInuserDetails = JSON.parse(localStorage.getItem('LoggedinUser'));
      this.actualBrokarage();
      this.channelPartnerModel.AccountId && this.channelPartnerModel.AccountId !== null ? this.getFundAccountDetails() : null;
      this.viewHistory();
    }
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.channelPartnerModel && this.channelPartnerModel) {
      this.disabletransferBtn = false;
    }
  }
  // ******* Bank details on Fund Id ******* //
  getFundAccountDetails = () => {
    this.bankDetailsonFunAccSubscription = this.paymentWalletService.bankDetailsonFunAcc(this.loggedInuserDetails, this.channelPartnerModel.AccountId).subscribe((response) => {
      if (response) {
        this.channelPartnerModel.BankName = response['bankName'];
        this.channelPartnerModel.AccountNo = response['bankAccountNumber'];
        this.channelPartnerModel.UPICode = response['vpAddress'];
        this.channelPartnerModel.paymentMode = response['accountType'];
      }
    });
  }
  // ******* show Brokarage Information modal Pop ******* //
  brokarageDetails = (input) => {
    this.BrokarageDetailsModal.show();
    this.transferHistoryDetails = false;
    switch (input) {
      case 'predict':
        this.BrokarageList = this.predictedBrokarageList;
        this.title = "Predict Earning Details"
        break;
      case 'actual':
        this.BrokarageList = this.actualBrokarageList;
        this.title = "Actual Earning Details";
        break;
    }
  }
  // ********* Show All Brokarage Details *********** //
  actualBrokarage = () => {
    this.actualBrokarageSubscription = this.paymentWalletService.actualBrokarage(this.loggedInuserDetails).subscribe((response) => {
      if (response && response['data']) {
        this.predictedBrokarageList = response['data'][0];
        this.predictAmount = response['data'][1][0]['PredictedAmount'];
        this.actualAmount = response['data'][2][0]['ActualAmount'];
        this.actualBrokarageList = response['data'][3];
      }
    });
  }
  // ********* Check Agreement number is Valid or not ********* //
  checkAgreementNo = (agreementNo) => {
    if (agreementNo) {
      this.checkAgreementnumberSubscription = this.paymentWalletService.checkAgreementnumber(this.loggedInuserDetails, agreementNo).subscribe((response) => {
        if (response && response['data'][0]['Amount'] !== null) {
          this.channelPartnerModel.withdrawalAmt = this.channelPartnerModel.actualAmount = response['data'][0]['Amount'];
          this.calculateBrokarage(this.channelPartnerModel);
          this.channelPartnerModel.TRUPayActualId = response['data'][0] && response['data'][0]['TRUPayActualId'];
          this.incorrectAgreementNo = false;
          this.disabletransferBtn = false;
        } else {
          this.incorrectAgreementNo = true;
        }
        this.showpaymentFields = false;
      });
    }
  }
  // **** on key up Event of Agreement null values **** // 
  agreementnoChnage = (agreementno) => {
    this.disabletransferBtn = true;
    this.channelPartnerModel.actualAmount = 0;
    this.channelPartnerModel.withdrawalAmt = 0;
    this.channelPartnerModel.balance = 0;
  }

  // ********** View transaction History ***********//
  viewHistory = () => {
    if (this.channelPartnerModel.AccountId) {
      this.viewTransferHistorySubscription = this.paymentWalletService.viewTransferHistory(this.loggedInuserDetails, this.channelPartnerModel.AccountId).subscribe((response) => {
        if (response && response['data'] && response['successful']) {
          this.transferHistory = response['data'];
          this.transferHistoryDetails = true;
          this.totalPayedAmt = response['data'] ? this.transferHistory.reduce((a, b) => +a + +b['amount'], 0) : 0;
        }
      })
    }
  }
  // ****** history Details pop up ***** //
  viewHistoryDetails = () => {
    this.BrokarageDetailsModal.show();
    this.viewHistory();
  }
  // ****** Create Razor pay Contact Account Api call ******* //
  createRazorContactAcc = () => {
    this.confirmationModal.hide();
    this.createRazorpayAccSubscription = this.paymentWalletService.createRazorpayAcc(this.loggedInuserDetails, this.channelPartnerModel).subscribe((response) => {
      if (response && response['successful']) {
        this.showSuccessBar('Razor Pay Contact Account Created Successfully');
        this.reloadEvent.emit(response['successful']);                                       // reload Cp Details
      } else {
        this.showFailedBar('Not Created Successfully');
      }
    });
  }
  // ****** Create Razor pay Fund Account Api call ******* //
  createRazorFundAcc = () => {
    this.confirmationModal.hide();
    this.channelPartnerModel.AccountType = this.channelPartnerModel.UPICode !== null && this.channelPartnerModel.UPICode !== '' ? "vpa" : "bank_account";
    this.createRazorpayfundAccSubscription = this.paymentWalletService.createRazorpayfundAcc(this.loggedInuserDetails, this.channelPartnerModel).subscribe((response) => {
      if (response && response['successful']) {
        this.showSuccessBar('Razor Pay Fund Account Created Successfully');
        this.reloadEvent.emit(response['successful']);                                          // reload Cp Details
      } else {
        this.showFailedBar('Not Created Successfully');
      }
    });
  }
  // *********Entered Withdrawal amount check correct or not ********* //
  calculateBrokarage = (channelPartnerModel) => {
    if (channelPartnerModel.withdrawalAmt <= channelPartnerModel.actualAmount) {
      this.channelPartnerModel.balance = channelPartnerModel.actualAmount - channelPartnerModel.withdrawalAmt;
      this.wrongAmtMsg = false;
    } else {
      this.wrongAmtMsg = true;
    }
  }
  // ************ transfer to bank Razor pay api call *************//
  transferToBank = (paymentDetails) => {
    this.confirmationModal.hide();
    if (paymentDetails.withdrawalAmt < 550) {
      // paymentDetails.actualwithdrawalAmt = paymentDetails.withdrawalAmt * 100;
      paymentDetails.inQueue = "false";
      paymentDetails.paymentMode = this.channelPartnerModel.paymentMode === 'vpa' ? 'UPI' : 'IMPS';
      paymentDetails.currencyType = "INR";
      paymentDetails.fundAccount = this.channelPartnerModel.AccountId;
      paymentDetails.TruPayActualId = this.channelPartnerModel.TRUPayActualId;
      this.disabletransferBtn = true;
      this.payoutSubscription = this.paymentWalletService.payout(this.loggedInuserDetails, paymentDetails).subscribe((response) => {
        if (response && response['successful'] && response['data']) {
          this.showSuccessBar(response['data']);
          this.channelPartnerModel.agreementNo = "";
          this.channelPartnerModel.withdrawalAmt = "";
          this.channelPartnerModel.actualAmount = "";
          this.channelPartnerModel.balance = "";
          this.showpaymentFields = false;
        } else {
          this.showFailedBar(response['data']);
        }
        this.actualBrokarage();
      });
      this.wrongAmtMsg = false;
    } else {
      this.wrongAmtMsg = true;
    }
  }

  // ************ get Confirmation for acoount creation Fund Transfer ************//
  confirmModal = (input) => {
    this.confirmationModal.show();
    switch (input) {
      case 'contact':
        this.title = "Create RazorPay Account";
        break;
      case 'fund':
        this.title = "Create RazorPay Fund Account";
        break;
      case 'withdraw':
        this.title = "Confirm Bank Details";
        break;
    }
  }

  //********** show snackbar for message **********//
  showFailedBar = (message: string) => {
    this.snackBar.open(message, null, { duration: 7000, panelClass: ['red-snackbar'] });
  }
  showSuccessBar = (message: string) => {
    this.snackBar.open(message, null, { duration: 7000, panelClass: ['blue-snackbar'] });
  }
  trackByFn(item) {
    return item.id; // unique id corresponding to the item
  }
  //********** on Destroy **********//
  ngOnDestroy() {
    this.actualBrokarageSubscription ? this.actualBrokarageSubscription.unsubscribe() : null;
    this.checkAgreementnumberSubscription ? this.checkAgreementnumberSubscription.unsubscribe() : null;
    this.viewTransferHistorySubscription ? this.viewTransferHistorySubscription.unsubscribe() : null;
    this.createRazorpayAccSubscription ? this.createRazorpayAccSubscription.unsubscribe() : null;
    this.createRazorpayfundAccSubscription ? this.createRazorpayfundAccSubscription.unsubscribe() : null;
    this.payoutSubscription ? this.payoutSubscription.unsubscribe() : null;
    this.payAccountSummerySubscription ? this.payAccountSummerySubscription.unsubscribe() : null;
  }
}
