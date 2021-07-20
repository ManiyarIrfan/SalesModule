import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { PaymentScheduleService } from 'src/app/shared/services/customer/payment-schedule.service';
import { routerTransition } from 'src/app/router.animations';
import { Subscription } from 'rxjs';
import { DemandLetterPdfService } from 'src/app/shared/services/shared/demand-letter-pdf.service';
import { ReceiptPdfService } from 'src/app/shared/services/shared/receipt-pdf.service';
import { IfinanceReciept, IpaymentDetails, ILeadDetails, ITotalValues } from 'src/app/shared/models/Customer/payment-details.model';
import { IloggedInuserDetails } from 'src/app/shared/models/Authentication/loggedInuserDetails.model';

@Component({
  selector: 'app-payment-schedule',
  templateUrl: './payment-schedule.component.html',
  styleUrls: ['./payment-schedule.component.scss'],
  animations: [routerTransition()]
})
export class PaymentScheduleComponent implements OnInit, OnDestroy {
  public showDataNotFoundMessage: boolean = true;
  public showstatement: string[] = [];
  public DataNotFoundMessage: string = "";
  public loggedInuserDetails: IloggedInuserDetails[] = [];
  public isSpinnerActive: boolean = true;
  public paymentDetails: IpaymentDetails[] = [];
  public paymentDetail: string[] = [];
  public paymentDetailsNotFound: boolean = false;
  public isShow: boolean = false;
  public q1: number;
  public financeDetails: string[] = [];
  public LeadDetails: ILeadDetails = <ILeadDetails>{};
  public financialDetailsNotFound: boolean = false;
  public financeReceipt: IfinanceReciept[] = [];
  public q2: number;
  public q3: number;
  public q4: number;
  public TotalValues: ITotalValues = <ITotalValues>{};
  public getOrderSubscription: Subscription;
  public getOrderIdSubscription: Subscription;
  public getFinancialSubscription: Subscription;

  constructor(public router: Router, private paymentService: PaymentScheduleService,
    private demandLetterPdfService: DemandLetterPdfService, private receiptPdfService: ReceiptPdfService) { }

  ngOnInit() {
    this.loggedInuserDetails = JSON.parse(localStorage.getItem('LoggedinUser'));
    this.getOrderSubscription = this.paymentService.getOrder(this.loggedInuserDetails).subscribe((response) => {
      if (response['exception'] === "No Data Found") {
        this.DataNotFoundMessage = response['exception'];
      } else {
        this.showDataNotFoundMessage = false;
        if (response && response["data"]) {
          this.showstatement = response["data"];
          this.getPaymentScheduleDetails(response["data"][0].OrderId);
          this.isShow = true;
        }
      }
      this.isSpinnerActive = false;
    });
  }

  toDataURL(url, callback) {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      const reader = new FileReader();
      reader.onloadend = function () {
        callback(reader.result);
      };
      reader.readAsDataURL(xhr.response);
    };
    xhr.open('GET', url);
    xhr.responseType = 'blob';
    xhr.send();
  }


  //-------- get payment schedule data -------//
  getPaymentScheduleDetails = (orderId) => {
    this.getOrderIdSubscription = this.paymentService.GetPaymentSchedule(this.loggedInuserDetails, orderId).subscribe((response) => {
      if (response && response['data'][0].length > 0) {
        this.paymentDetails = response['data'][0];
        this.financeReceipt = response['data'][1];
        this.paymentDetail = response['data'][2];
        this.TotalValues['AllTotalAmount'] = response['data'][2].reduce((a, b) => +a + +b["TotalAmount"], 0);
        this.TotalValues['TotalPercentage'] = response['data'][2].reduce((a, b) => +a + +b["Percentage"], 0);
        this.TotalValues['AllTotalDemandRemaining'] = response['data'][2].reduce((a, b) => +a + +b["TotalDemandRemaining"], 0);
        this.TotalValues['TotalAdvancePayment'] = response['data'][2].reduce((a, b) => +a + +b["AdvancePayment"], 0);
        this.TotalValues['TotalAmountReceived'] = response['data'][2].reduce((a, b) => +a + +b["AmountReceived"], 0);
        this.LeadDetails = response['data'][3][0] ? response['data'][3][0] : {};
        this.paymentDetailsNotFound = true;
      } else {
        this.paymentDetailsNotFound = false;
        this.isShow = false;
      }
    })
  }
  downloadReceipt(orderDetails, LeadData) {
    this.receiptPdfService.download(orderDetails, LeadData);
  }
  downloadDemandLetter(orderDetails, LeadData) {
    LeadData.DiscountSubTotal = orderDetails.DiscountSubTotal;
    this.demandLetterPdfService.download(orderDetails, LeadData);
  }
  trackByFn(item) {
    return item.id; // unique id corresponding to the item
  }
  ngOnDestroy() {
    this.getOrderSubscription ? this.getOrderSubscription.unsubscribe() : null;
    this.getOrderIdSubscription ? this.getOrderIdSubscription.unsubscribe() : null
    this.getFinancialSubscription ? this.getFinancialSubscription.unsubscribe() : null;
  }
}