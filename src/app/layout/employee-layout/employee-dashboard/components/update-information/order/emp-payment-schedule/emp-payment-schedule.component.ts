import { Component, OnInit, ViewChild, SimpleChanges, Input, OnDestroy, OnChanges, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ModalDirective } from 'ngx-bootstrap';
import { OrderService } from 'src/app/shared/services/employee/order.service';
import { DemandLetterPdfService } from 'src/app/shared/services/shared/demand-letter-pdf.service';
import { IfilterDataModel } from 'src/app/shared/models/employeeModel/emp-payment-schedule';
@Component({
  selector: 'tru-emp-payment-schedule',
  templateUrl: './emp-payment-schedule.component.html',
  styleUrls: ['./emp-payment-schedule.component.scss']
})
export class EmpPaymentScheduleComponent implements OnInit, OnDestroy, OnChanges, AfterViewInit {
  public isShow: boolean = false;
  @ViewChild('popupPaymentModel', { static: false }) public popupPaymentModel: ModalDirective;
  @ViewChild('ConfirmationModal', { static: false }) public ConfirmationModal: ModalDirective;
  @ViewChild('popupMilestoneModel', { static: false }) public popupMilestoneModel: ModalDirective;
  @Input() orderDetails: any = [];
  public gridKey: any = [];
  public showSubmitBtn: boolean = false;
  public showAddInstallmentBtn: boolean = true;
  public showSuccessfullMessage: string = "";
  public showUnsuccessfullMessage: string = "";
  public loggedInuserDetails: any;
  public orderModel: any = {};
  public paymentModel: any = {};
  public paymentScheduleModel: any = {};
  public showmilestone: string[] = [];
  public TaxReceived: any;
  public TotalDemandRaised: any;
  public TotalAfterBookingAmount: number = 0;
  public paymentScheduleFields: any = [];
  public showTotalDemandRaisedExceed: string;
  public sumTotalDemandRaised: any;
  public NoDataFoundMessage: string = '';
  public updateBtn: boolean = false;
  public hideHeader: boolean;
  public counter: number = 1;
  public p1: number;
  public filterDataModel: IfilterDataModel = <IfilterDataModel>{};
  public dropdowndata: string[] = [];
  public showData: string[] = [];
  public statusInfo: any = [
    { key: "Demand Sent", value: "Demand Sent" },
    { key: "Payment Received", value: "Payment Received" },
    { key: "Partial Payment Received", value: "Partial Payment Received" },
    { key: "Payment Pending", value: "Payment Pending" }];
  public PayAgainstInfo = [
    // { key: "Booking", value: "Booking" },
    { key: "On Agreement", value: "On Agreement" },
    { key: "Plinth", value: "Plinth" },
    { key: "1st Slab", value: "1st Slab" },
    { key: "2nd Slab", value: "2nd Slab" },
    { key: "3rd Slab", value: "3rd Slab" },
    { key: "4th Slab", value: "4th Slab" },
    { key: "5th Slab", value: "5th Slab" },
    { key: "6th Slab", value: "6th Slab" },
    { key: "7th Slab", value: "7th Slab" },
    { key: "8th Slab", value: "8th Slab" },
    { key: "9th Slab", value: "9th Slab" },
    { key: "10th Slab", value: "10th Slab" },
    { key: "11th Slab", value: "11th Slab" },
    { key: "12th Slab", value: "12th Slab" },
    { key: "13th Slab", value: "13th Slab" },
    { key: "14th Slab", value: "14th Slab" },
    { key: "15th Slab", value: "15th Slab" },
    { key: "16th Slab", value: "16th Slab" },
    { key: "17th Slab", value: "17th Slab" },
    { key: "18th Slab", value: "18th Slab" },
    { key: "19th Slab", value: "19th Slab" },
    { key: "20th Slab", value: "20th Slab" },
    { key: "21st Slab", value: "21st Slab" },
    { key: "22th Slab", value: "22th Slab" },
    { key: "23th Slab", value: "23th Slab" },
    { key: "24th Slab", value: "24th Slab" },
    { key: "25th Slab", value: "25th Slab" },
    { key: "26th Slab", value: "26th Slab" },
    { key: "27th Slab", value: "27th Slab" },
    { key: "28th Slab", value: "28th Slab" }];
  public ListOffilter = [{ item: 'stages' }, { item: 'Percentage' }, { item: 'Details' }]
  public DiscountAmount: boolean = false;
  public discountAndGstModel: any = {};
  public showSuccessfullOcrMessage: string = '';
  public showUnsuccessfullOcrMessage: string = '';
  public disableBtn: boolean = false;
  private _paymentscheduleSubscription: Array<Subscription> = [];

  constructor(
    public router: Router,
    private orderService: OrderService,
    private demandLetterPdfService: DemandLetterPdfService) { }

  ngOnInit() {
    if (localStorage.getItem('LoggedinUser')) {
      this.loggedInuserDetails = JSON.parse(localStorage.getItem('LoggedinUser'));
      if (this.loggedInuserDetails) {
        this.getPaymentScheduleGrid();
        this.updateBtn = false;
      }
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.orderDetails && this.orderDetails) {
      this.orderModel.OrderId = this.orderDetails.OrderId;
      this.discountAndGstModel = this.orderDetails;
      this.orderModel.TotalAmountPaid = this.orderDetails.TotalAmountPaid || 0;
      // this.orderModel.TotalDemandRaised = (this.orderDetails.TotalDemandRaised - this.orderDetails.BookingAmount) < 0 ? this.orderDetails.TotalDemandRaised : (this.orderDetails.TotalDemandRaised - this.orderDetails.BookingAmount);
      this.orderModel.TotalDemandRaised = this.orderDetails.TotalDemandRaised || 0;
      this.orderModel.TotalGSTRaised = Math.round(Number(this.orderDetails.TotalGSTRaised));
      this.orderModel.TotalAgreedAmount = this.orderDetails.TotalValue;
      this.orderModel.DiscountSubTotal = this.orderDetails.DiscountSubTotal;
      this.orderModel.TotalTaxReceived = this.orderDetails.TotalTaxReceived;
      this.orderModel.TotalAmountRemaining = this.orderDetails.TotalAmountRemaining || 0;
      this.orderModel.TotalGSTRemaining = this.orderDetails.TotalGSTRemaining;
      this.discountAndGstModel.DiscountSubTotal = this.orderDetails.DiscountSubTotal ? this.orderDetails.DiscountSubTotal : this.orderModel.TotalAgreedAmount;
      this.discountAndGstModel.Discount = this.orderModel.DiscountSubTotal - this.discountAndGstModel.DiscountSubTotal;
      this.discountAndGstModel.TotalTax = this.orderDetails.TotalTax ? this.orderDetails.TotalTax : 0;
      this.orderModel.GST = this.orderDetails.GST ? this.orderDetails.GST : 0;
      this.orderModel.TotalGSTPaid = this.orderDetails.TotalGSTPaid || 0;
      this.orderModel.BookingAmount = this.orderDetails.BookingAmount;
      this.orderModel.InfraCharge = this.orderDetails.InfraCharge || 0;
      this.TotalAfterBookingAmount = Number(this.orderModel.DiscountSubTotal) - Number(this.orderModel.InfraCharge);
      this.orderModel.TotalInfraRemaining = this.orderDetails.TotalInfraRemaining || 0;
      this.orderModel.TotalInfraPaid = this.orderDetails.TotalInfraPaid || 0;
      this.orderModel.TotalInfraRaised = this.orderDetails.TotalInfraRaised || 0;
    }
  }
  ngAfterViewInit() {
    this.loggedInuserDetails = JSON.parse(localStorage.getItem('LoggedinUser'));
    this.getMilestoneData();
  }
  // ***** Get Milestone Details **** //
  getMilestoneData() {
    const GetAllMilestoneData = this.orderService.GetAllMilestoneData(this.loggedInuserDetails, this.orderDetails.ProjectId ? this.orderDetails.ProjectId : null).subscribe((response) => {
      if (response && response["data"] && response["data"].length > 0) {
        this.dropdowndata = this.showData = this.showmilestone = response["data"];
        this.isShow = true;
      } else {
        this.showmilestone = [];
        this.isShow = false;
      }
    });
    this._paymentscheduleSubscription.push(GetAllMilestoneData);
  }
  findPercentage(MilestoneId) {
    let MileStoneData = (this.showmilestone.filter(x => x['MilestoneId'] === Number(MilestoneId)));
    if (MilestoneId && MilestoneId !== '') {
      // this.paymentScheduleModel.Percentage = (this.showmilestone && this.showmilestone.length > 0) ? (this.showmilestone.filter(x => x['MilestoneId'] === Input))[0].Percentage : null;
      this.paymentScheduleModel.Percentage = (MileStoneData && MileStoneData[0] && MileStoneData[0]['Percentage']) ? MileStoneData[0]['Percentage'] : null;
      this.paymentScheduleModel.Percentage ? this.onTotalPercentChange(this.paymentScheduleModel.Percentage) : null;
    }
    else {
      this.paymentScheduleModel.Percentage = this.paymentScheduleModel.TaxReceived = this.TotalDemandRaised = null;
      // this.grandTotalDemandRaised = null;
    }
  }
  insertOcrDetails = () => {
    const orderOcrDetails = this.orderService.orderOcrDetails(this.loggedInuserDetails, this.orderModel, this.discountAndGstModel).subscribe((response) => {
      (response && response['successful']) ?
        this.showSuccessfullOcrMessage = "Submitted Successfully" :
        this.showUnsuccessfullOcrMessage = "Failed To Submit";
      setTimeout(() => {
        this.showSuccessfullOcrMessage = this.showUnsuccessfullOcrMessage = '';
      }, 5000);
    });
    this._paymentscheduleSubscription.push(orderOcrDetails);
  }

  getPaymentScheduleGrid() {
    const GetPaymentScheduleDetails = this.orderService.GetPaymentScheduleDetails(this.loggedInuserDetails, this.orderModel.OrderId, 0).subscribe((response) => {
      if (response && response['data'][0].length > 0) {
        this.paymentScheduleFields = response['data'][0];
        this.sumTotalDemandRaised = response['data'][0].reduce((a, b) => +a + +b["TotalDemandRaised"], 0);;
      } else {
        this.NoDataFoundMessage = "The Payment Schedule data is not found, please add the Installment as required.";
      }
    });
    this._paymentscheduleSubscription.push(GetPaymentScheduleDetails);
  }
  openVerifyPopup = (paymentModel, Flag) => {
    this.paymentModel = paymentModel;
    this.paymentModel.Flag = Flag;
    this.ConfirmationModal.show();
  }
  confirmation = (Action) => {
    switch (Action) {
      case 'yes':
        this.paymentModel.Flag ? this.OnInsertPaymentScheduleBtnClick(this.paymentModel, 'Verification') : this.OnInsertPaymentScheduleBtnClick(this.paymentModel, 'Publish');
        break;
      default:
        this.paymentModel = {};
        this.ConfirmationModal.hide();
        break;
    }
  }
  OnInsertPaymentScheduleBtnClick = (payment, Action) => {
    payment.TotalDemandRaised = (Action === 'INSERT') ? this.TotalDemandRaised : payment.TotalDemandRaised;
    if (Action === 'INSERT') {
      payment.Status = "Invoice Generated"
    } else if (Action === 'Publish') {
      payment.Status = "Sent To Customer"
    }
    // else {
    //   payment.Status = payment.Status
    // }
    this.disableBtn = true;
    payment.Action = (Action === 'Publish') ? 'UPDATE' : Action;
    // payment.CustomerStatus = (Action === 'Publish') ? 'Unpaid' : null;
    payment.CustomerStatus = (Action === 'Publish') ? (payment.CustomerStatus === 'Partially Paid' || 'Totally Paid') ? payment.CustomerStatus : 'Unpaid' : null;
    payment.AdvancePaymentUsed = (this.paymentScheduleFields && this.paymentScheduleFields !== null || this.paymentScheduleFields !== undefined)
      ? this.paymentScheduleFields['AdvancePayment'] : null;
    const InsertPaymentSchedule = this.orderService.InsertPaymentSchedule(payment, this.orderModel, this.loggedInuserDetails).subscribe((response) => {
      if (response && response['successful'] && response['data']) {
        this.showSuccessfullMessage = (payment.Status === "Sent To Customer") ? "Invoice Sent To Customer" : "Submitted Successfully";
        this.getPaymentScheduleGrid();
        this.updateBtn = false;
        this.showAddInstallmentBtn = true;
        payment.VerificationStatus = response['data'][0] ? (response['data'][0].VerificationStatus ? response['data'][0].VerificationStatus : '') : '';
        this.ConfirmationModal.hide();
      } else {
        this.showUnsuccessfullMessage = "Failed To Submit";
        this.showAddInstallmentBtn = false;
      }
      setTimeout(() => {
        this.showSuccessfullMessage = '';
        this.showUnsuccessfullMessage = '';
      }, 5000);
      this.disableBtn = false;
    });
    this._paymentscheduleSubscription.push(InsertPaymentSchedule);
  }
  updatePaymentSchedule = (paymentDetails) => {
    this.OnClickAddInstallment();
    this.updateBtn = true;
    this.paymentScheduleModel.InstallmentNo = paymentDetails.InstallmentNo;
    this.paymentScheduleModel.PayAgainst = paymentDetails.PayAgainst;
    this.paymentScheduleModel.Percentage = paymentDetails.Percentage;
    this.paymentScheduleModel.TotalDemandRaised = paymentDetails.TotalDemandRaised;
    this.paymentScheduleModel.TaxReceived = paymentDetails.TaxReceived;
    this.paymentScheduleModel.EstimatedBillingDate = paymentDetails.EstimatedBillingDate;
    this.TotalDemandRaised = paymentDetails.TotalDemandRaised;
    this.paymentScheduleModel.Status = paymentDetails.Status;
    this.paymentScheduleModel.PSId = paymentDetails.PSId;
  }

  OnClickAddInstallment() {
    this.paymentScheduleFields.forEach((item) => {
      this.gridKey.push(item.PayAgainst);
    })
    this.paymentScheduleModel = {};
    this.paymentScheduleModel.InstallmentNo = this.paymentScheduleFields.length + 1;
    this.showAddInstallmentBtn = false;
    this.showSuccessfullMessage = '';
    this.showUnsuccessfullMessage = '';
    this.TotalDemandRaised = '';
    this.TaxReceived = '';
    this.paymentScheduleModel.Status = "";
    this.paymentScheduleModel.PayAgainst = "";
    this.paymentScheduleModel.TaxReceived = this.discountAndGstModel.GstAmount;
  }
  OnCancelBtnClick() {
    // this.showPaymentScheduleGrid = false;
    this.showAddInstallmentBtn = true;
    this.paymentScheduleModel = {};
    this.showSuccessfullMessage = '';
    this.showUnsuccessfullMessage = '';
    this.updateBtn = false;
  }
  onTotalPercentChange = (percentageValue) => {
    this.TotalDemandRaised = '';
    if (percentageValue !== null) {
      let sum = 0;
      let grandTotalInfraDemandRaised = 0;
      let grandTotalGstDemandRaised = 0;
      let grandTotalDemandRaised = 0;

      sum = this.paymentScheduleFields.reduce((a, b) => +a + +b['Percentage'], 0);
      let total = sum + percentageValue;
      this.TotalDemandRaised = (this.TotalAfterBookingAmount * percentageValue) / 100;
      grandTotalDemandRaised = Number(this.orderModel.TotalAmountPaid) + this.TotalDemandRaised - Number(this.orderModel.BookingAmount);
      this.paymentScheduleModel.TaxReceived = Math.round(Number(this.orderModel.GST) * Number(percentageValue) / 100);
      grandTotalGstDemandRaised = this.paymentScheduleModel.TaxReceived + this.orderModel.TotalGSTRaised;
      this.paymentScheduleModel.InfraReceived = Math.round(Number(this.orderModel.InfraCharge) * Number(percentageValue) / 100);
      grandTotalInfraDemandRaised = this.paymentScheduleModel.InfraReceived + this.orderModel.TotalInfraRaised;

      if (grandTotalDemandRaised > this.TotalAfterBookingAmount || total > 100) {
        this.popupPaymentModel.show();
        this.showTotalDemandRaisedExceed = "The Total Demand Raised is Exceeding than Total Agreed Amount!";
        this.showSubmitBtn = true;
      } else {
        this.showSubmitBtn = false;
      }
      if (grandTotalGstDemandRaised > this.orderModel.GST || total > 100) {
        this.popupPaymentModel.show();
        this.showTotalDemandRaisedExceed = "The Total Tax Received is Exceeding than Total Gst Amount!";
        this.showSubmitBtn = true;
      } else {
        this.showSubmitBtn = false;
      }
      if (grandTotalInfraDemandRaised > this.orderModel.Infra || total > 100) {
        this.popupPaymentModel.show();
        this.showTotalDemandRaisedExceed = "The Total Infra Received is Exceeding than Total Infra Amount!";
        this.showSubmitBtn = true;
      } else {
        this.showSubmitBtn = false;
      }
    }
  }
  download(orderDetails, LeadData) {
    this.demandLetterPdfService.download(orderDetails, LeadData);
  }
  getToday(): string {
    return new Date().toISOString().split('T')[0]
  }
  OnClickselect = () => {
    this.popupMilestoneModel.show();
  }
  onClose = () => {
    this.popupMilestoneModel.hide();
  }
  checkedState = (details) => {
    this.paymentScheduleModel.MilestoneId = details.MilestoneId;
    this.findPercentage(details.MilestoneId);
    this.popupMilestoneModel.hide();
  }
  filterLeadData = () => {
    let counter = 0;
    this.ListOffilter.map(element => {
      if (element && this.filterDataModel[element.item]) {
        let Data = counter > 0 ? this.showmilestone : this.showData;
        this.showmilestone = Data.filter(x => x[element.item] && x[element.item].toString().toLowerCase().indexOf(String(this.filterDataModel[element.item]).toLowerCase()) !== -1);
        counter++;
      }
    });
    this.showmilestone = counter === 0 ? this.showData : this.showmilestone;
  }
  trackByFn(item) {
    return item.id; // unique id corresponding to the item
  }
  ngOnDestroy() {
    for (let item of this._paymentscheduleSubscription) {
      item.unsubscribe();
    }
  }
}