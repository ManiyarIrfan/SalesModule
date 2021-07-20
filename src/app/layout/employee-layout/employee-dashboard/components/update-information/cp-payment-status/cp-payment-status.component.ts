import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { SharedService } from 'src/app/shared/services/shared/shared.service';
import { CpPaymentStatusService } from 'src/app/shared/services/employee/cp-payment-status.service';
import { Observable, Subscription } from 'rxjs';
import { FileAttachment } from 'src/app/shared/components/file-upload/file-attachment.model';
import { IpaymentStatusModel, IshowData, IsessionModel, Idetails } from 'src/app/shared/models/employeeModel/cp-payment-status.model';
import { MatSnackBar } from '@angular/material';
import { IloggedInuserDetails } from 'src/app/shared/models/Authentication/loggedInuserDetails.model';

@Component({
  selector: 'tru-cp-payment-status',
  templateUrl: './cp-payment-status.component.html',
  styleUrls: ['./cp-payment-status.component.scss']
})
export class CpPaymentStatusComponent implements OnInit, OnDestroy {
  // public orderId: number;
  public brokertotal: number;
  public message: string;
  public isSpinnerActive: boolean = false;
  public sum: number = 0;
  public paymentMade: number = 0;
  public details: Idetails = <Idetails>{};
  public paymentStatusModel: IpaymentStatusModel = <IpaymentStatusModel>{};
  public sessionModel: IsessionModel = <IsessionModel>{};
  public showOrderIdDetails: string[] = [];
  public selectedTip: string;
  public showOrderDetails: string[];
  public p1: number;
  public d1: number;
  public showData: IshowData = <IshowData>{};
  public cpPaymentStatus: Observable<any[]>;
  public searchText = '';
  public flag: boolean = true;
  public userInuserDetails: string;
  public loggedInuserDetails: IloggedInuserDetails = <IloggedInuserDetails>{};
  public showOrder: boolean = false;
  public showAddBtn: boolean = false;
  public showInformation: boolean = false;
  public showDataNotFoundMessage: boolean = false;
  public showDataNotFoundMessageOne: boolean = false;
  public isOn: boolean = false;
  public NoDataFoundMessage: string = "";
  public NoDataFoundMessageOne: string = "";
  public isCollapsed: boolean = true;
  public isLoading: boolean = false;
  public uploadFileList: FileAttachment[] = [];
  public duplicateInVoiceNo: string = "";
  public isDuplicate: boolean;
  public showDatacp:string[]=[];
  public OnInsertBtnClickSubscription: Subscription;
  public getPaymentStatusSubscription: Subscription;
  public searchSub: Subscription;
  

  @ViewChild('popupPaymentModel', { static: false }) public popupPaymentModel: ModalDirective;

  constructor(private sharedService: SharedService, private cpPaymentStatusService: CpPaymentStatusService, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.loggedInuserDetails = JSON.parse(localStorage.getItem('LoggedinUser'));
  }

  searchChannelPartner(term: string): void {
    this.flag = true;
    this.searchSub = this.sharedService.search(this.loggedInuserDetails, term).subscribe((response) => {
      this.cpPaymentStatus = response['data'].filter(x => x.UserType === 'ChannelPartner');
    })
    this.clearMessage();
    this.showInformation = false;
    this.showOrder = false;
  }
  onselectChannelPartner(ClientObj) {
    this.isSpinnerActive = true;
    if (ClientObj.ClientId != 0) {
      this.searchText = `${ClientObj.FirstName} - ${ClientObj.LastName} - ${ClientObj.MobileNo} - ${ClientObj.UserId}`;
      this.userInuserDetails = ClientObj;
      this.sharedService.shareSelectedUser(ClientObj);
      if (ClientObj.UserType === "ChannelPartner") {
        this.cpPaymentStatusService.GetOrderDetailByBrokerId(ClientObj).subscribe((response) => {
          if (response && response["data"]) {
            if (response['exception']) {
              this.showDataNotFoundMessage = true;
              this.NoDataFoundMessage = response['exception'] + " in Order!";
            }
            else {
              this.showDataNotFoundMessage = false;
            }
            this.showOrderDetails = response['data'];
            this.message = "";
            this.showInformation = true;
          }
        });
        this.cpPaymentStatusService.GetChannelPartnerDetails(ClientObj).subscribe((response) => {
          if (response && response['data']) {
            this.showDatacp = response['data'][0];
            this.showInformation = true;
            this.message = "";
            this.isSpinnerActive = false;
            this.showInformation = true;
          }
        });
        this.flag = false;
      } else {
        this.message = "User is not Channel Partner."
        this.flag = false;
        this.isSpinnerActive = false;
        return false;
      }
    }
    this.clearMessage();
    this.isOn = false;
  }
  getPaymentStatus = (details, cpPaymentStatusForm) => {
   let TempOrderId = details.OrderId;
    // this.orderId = details.OrderId;
    this.getPaymentStatusSubscription = this.cpPaymentStatusService.GetPaymentStatusDetailByOrderId(this.loggedInuserDetails, details).subscribe((response) => {
      if (response && response["data"]) {
        if (response['exception'] === "No Data Found") {
          this.brokertotal = details.IncentiveValue;
          this.showDataNotFoundMessageOne = true;
          this.NoDataFoundMessageOne = "There is no Payment Details for OrderId : " + TempOrderId;
        } else {
          this.brokertotal = response["data"][0].BrokerageAmount;
          this.showDataNotFoundMessageOne = false;
          this.NoDataFoundMessageOne = "";
        }
        this.NoDataFoundMessage = "";
        this.sessionModel['OrderId'] = details.OrderId;
        this.showOrderIdDetails = response['data'];
        this.showOrder = true;
        this.isLoading = false;
      }
    });
    if (details.AgreementStatus == "Registration Done" && details.OrderStatus == "Approved") {
      this.isOn = true;
    }
    if (details.AgreementStatus != "Registration Done") {
      this.isOn = false;
    }
    this.isLoading = true;
    this.isCollapsed = true;
    this.createNewPayment(cpPaymentStatusForm);
  }
  OnInsertBtnClick = (paymentStatusModel, uploadFileList, cpPaymentStatusForm) => {
    if (this.loggedInuserDetails) {
      this.OnInsertBtnClickSubscription = this.cpPaymentStatusService.InsertPaymentStatus(this.paymentStatusModel, this.sessionModel, uploadFileList, this.loggedInuserDetails).subscribe((response) => {
        if (response && (response['successful'] || response['value']['successful'])) {
          this.showSuccessBar("Successfully Inserted The Installment");
          this.getPaymentStatus(this.sessionModel, cpPaymentStatusForm);
          this.NoDataFoundMessageOne = "";
        } else {
          this.showFailedBar("Could not create Installment");
        }
        this.createNewPayment(cpPaymentStatusForm);
        this.isOn = true;
        this.isCollapsed = true;
      });
      this.brokertotal
    }
  }
  sameInVoiceNo = (showOrderIdDetails) => {
    this.duplicateInVoiceNo = '';
    this.isDuplicate = false;
    let test = showOrderIdDetails.filter(x => x.InVoiceNo === this.paymentStatusModel.InVoiceNo);
    if (test && test.length > 0) {
      this.duplicateInVoiceNo = "Duplicate InVoiceNo";
      this.isDuplicate = true;
    }
  }
  calculate = () => {
    this.sum = 0;
    this.paymentMade = 0;
    this.showOrderIdDetails.forEach((item, index) => {
      this.paymentMade = this.showOrderIdDetails[index]['PaymentMade'];
      this.sum += this.paymentMade;
    })
    this.brokertotal;
    this.paymentMade = parseInt(this.paymentStatusModel.PaymentMade);
    let totalPaymentMade = this.paymentMade + this.sum;
    if (totalPaymentMade > this.brokertotal) { //compare Brokerage Amount is not greater than total of Payment Mode
      this.popupPaymentModel.show();
      this.message = "The Total Amount paid is more than Brokrage Amount!"
      this.showAddBtn = false;
    } else {
      this.showAddBtn = true;
    }
    this.clearMessage();
  }
  showFile = (pdfUrl) => {
    window.open(pdfUrl);
  }

  clearMessage = () => {
    this.NoDataFoundMessage = "";
  }
  close = () => {
    this.popupPaymentModel.hide();
    this.message = ""
  }
  createNewPayment = (cpPaymentStatusForm) => {
    this.paymentStatusModel = <IpaymentStatusModel>{};
    cpPaymentStatusForm.form.markAsPristine();
    cpPaymentStatusForm.form.markAsUntouched();
    this.uploadFileList = [];
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
    this.OnInsertBtnClickSubscription ? this.OnInsertBtnClickSubscription.unsubscribe() : null;
    this.getPaymentStatusSubscription ? this.getPaymentStatusSubscription.unsubscribe() : null;
    this.searchSub ? this.searchSub.unsubscribe() : null;

  }
  trackByFn(item) {
    return item.id; // unique id corresponding to the item
  }
}
