import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { PaymentReceiptService } from 'src/app/shared/services/employee/payment-receipt.service';
import { FileAttachment } from 'src/app/shared/components/file-upload/file-attachment.model';
import { OrderService } from 'src/app/shared/services/employee/order.service';
import { MatSnackBar } from '@angular/material';
import { ModalDirective } from 'ngx-bootstrap';
import { ReceiptPdfService } from 'src/app/shared/services/shared/receipt-pdf.service';

@Component({
  selector: 'tru-payment-receipt',
  templateUrl: './payment-receipt.component.html',
  styleUrls: ['./payment-receipt.component.scss']
})
export class PaymentReceiptComponent implements OnInit, OnDestroy {
  @ViewChild('ConfirmationModal', { static: false }) public ConfirmationModal: ModalDirective;
  public loggedInuserDetails: any;
  public showOrderDetails: any = [];
  public paymentDetail: any = [];
  public paymentDetails: any = [];
  public createReceiptModel: any = [];
  public paymentSchedules: any = [];
  public uploadpaymentReceipt: FileAttachment[] = [];
  public isSpinnerActive: boolean = true;
  public disableBtn: boolean = false;
  public createReceipt = false;
  public rejectedData: any = [];
  public filterDataModel: any = {};
  public storeData: string[] = [];
  public StoreDetails: any = [];
  public legacyDetails: string[] = [];
  public isFound: boolean = true;
  public q1: number;
  public getSearchDetailsSubscribtion: Subscription;
  public createReceiptSubscription: Subscription;
  public GetPaymentScheduleSubscription: Subscription;

  public bankNamesInfo: any = [
    { key: "SBI", value: "SBI" },
    { key: "HDFC", value: "HDFC" },
    { key: "IDBI", value: "IDBI" },
    { key: "ICICI", value: "ICICI" },
    { key: "AXIS", value: "AXIS" },
    { key: "Bank Of India", value: "Bank Of India" },
    { key: "Punjab National Bank", value: "Punjab National Bank" },
    { key: 'Pune Dist Cooperative Bank', value: 'Pune Dist Cooperative Bank' },
    { key: 'Kotak Mahindra Bank', value: 'Kotak Mahindra Bank' },
    { key: 'Oriental Bank of Commerce', value: 'Oriental Bank of Commerce' },
    { key: 'Indian Bank', value: 'Indian Bank' },
    { key: "Others", value: "Others" }];
  public PaidByInfo: any = [
    { key: "Cheque/DD", value: "Cheque/DD" },
    { key: "Internet Banking", value: "Internet Banking" },
    { key: "Cash", value: "Cash" }];
  public ListOffilter = [
    { item: 'OrderId' },
    { item: 'CustomerName' },
    { item: 'BHK' },
    { item: 'FLATNO' },
    { item: 'AccountingStatus' },
    { item: 'RejectionReason' },
    { item: 'VoucherType' },
    { item: 'ReceiptNo' }]
  public showtextField: boolean = false;
  public p: number;
  public storeId: number;
  public storeConversion: string = '';
  public isAvailable: boolean = false;
  public storeDetails: any = [];
  public selectedIndex = 0;
  public isdisable = false
  public isLoading = false;
  public disableadvPaymentField: boolean = true;
  public FullgstinfraPaid: boolean = true;

  constructor(public paymentReceiptService: PaymentReceiptService, private orderService: OrderService,
    private snackBar: MatSnackBar, private receiptPdfService: ReceiptPdfService) { }

  ngOnInit() {
    if (localStorage.getItem('LoggedinUser')) {
      this.loggedInuserDetails = JSON.parse(localStorage.getItem('LoggedinUser'));
      this.isSpinnerActive = true;
      this.disableBtn = false;
      this.getSearchDetailsSubscribtion = this.paymentReceiptService.GetRejectedPayment(this.loggedInuserDetails, 'PaymentReceipt').subscribe((response) => {
        this.showOrderDetails = (response && response['data']) ? response['data'] : [];
        this.isSpinnerActive = false;
      });
      this.createReceiptModel.PayAgainst1 = "";
      this.rejectedPaymentDetails();
    }
  }

  // ******** Get payment/Receipt details show By OrderId ******* //
  paymentScheduleDetails = (OrderId) => {
    this.storeId = OrderId ? OrderId : null;
    this.GetPaymentScheduleSubscription = this.paymentReceiptService.GetPaymentSchedule(this.loggedInuserDetails, OrderId).subscribe((response) => {
      if (response && response['data']) {
        this.paymentDetails = (response['data'] && response['data'][0]) ? response['data'][0] : [];
        this.paymentDetail = (response['data'] && response['data'][1]) ? response['data'][1] : [];
      }
    });
  }
  // ******** Get payment/Receipt details show By OrderId ******* //
  rejectedPaymentDetails = () => {
    this.GetPaymentScheduleSubscription = this.paymentReceiptService.GetRejectedPayment(this.loggedInuserDetails, 'AccountingStatus').subscribe((response) => {
      if (response && response['data'] && response['data'].length > 0) {
        this.rejectedData = response['data'];
        this.storeData = response['data'];
        this.isFound = true;
      } else {
        this.isFound = false;
      }
    });
  }
  GoToCreate(data) {
    if (data) {
      this.createReceiptModel.OrderId = data.OrderId ? data.OrderId + ' - ' + data.CustomerName + ' - ' + data.FLATNO : null;
      this.createReceiptModel['StoreOrderID'] = data.OrderId ? data.OrderId : null;
      this.createReceiptModel.PSId = data.InvoiceNo ? data.InvoiceNo : null;
      this.createReceiptModel['StorePSID'] = data.PSId ? data.PSId : null;
      this.createReceiptModel.ReceiptDate = data.ReceiptDate ? data.ReceiptDate.split('T')[0] : null;
      this.createReceiptModel.PayBy = data.PayBy ? data.PayBy : null;
      this.createReceiptModel.BankName = data.BankName ? data.BankName : null;
      this.createReceiptModel.Branch = data.BankName ? data.Branch : null;
      this.createReceiptModel.ChequeDate = data.ChequeDate ? data.ChequeDate.split('T')[0] : null;
      this.createReceiptModel.ChequeNumber = data.ChequeNumber ? data.ChequeNumber : null;
      this.createReceiptModel.PaidAgainstDue = data.PaidAgainstDue ? data.PaidAgainstDue : 0;
      this.createReceiptModel.ServiceTax = data.ServiceTax ? data.ServiceTax : 0;
      this.createReceiptModel.InfraCharges = data.Infra ? data.Infra : 0;
      this.createReceiptModel.TotalInfraReceiptAmount = data.TotalInfraReceiptAmount ? data.TotalInfraReceiptAmount : 0;
      this.createReceiptModel.LegalName = data.LegalEntityName ? data.LegalEntityName : null;
      this.createReceiptModel.address = data.LegalEntityAddress ? data.LegalEntityAddress : null;
      this.createReceiptModel.Remark = data.Remark ? data.Remark : null;
      this.createReceiptModel.TotalDemandRaised = data.TotalDemandRaised ? data.TotalDemandRaised : 0;
      this.createReceiptModel.TotalAmountwithoutGSTInfra = data.TotalAmountwithoutGSTInfra ? data.TotalAmountwithoutGSTInfra : 0;
      this.createReceiptModel.TaxReceived = data.TotalGstReceiptAmount ? data.TotalGstReceiptAmount : 0;
      this.createReceiptModel.TotalGstReceiptAmount = data.TotalGstReceivedAmount ? data.TotalGstReceivedAmount : 0;
      this.createReceiptModel.InstallmentNo = data.InstallmentNo ? data.InstallmentNo : null
      this.createReceiptModel.ReceiptNo = data.ReceiptNo ? data.ReceiptNo : null;
      this.createReceiptModel.ImageUrl = data.ImageUrl ? data.ImageUrl : null;
      this.createReceiptModel['ImageId'] = data.ImageId ? data.ImageId : null;
      this.createReceipt = true;
      this.isAvailable = false;
      this.selectedIndex = 0;
      this.isdisable = true;
    }
  }
  selectTab(index: any) {
    this.selectedIndex = index.index;
  }
  //************* filter table popup data **************//
  filterLeadData() {
    let counter = 0;
    this.ListOffilter.map(element => {
      if (element && this.filterDataModel[element.item]) {
        let Data = counter > 0 ? this.rejectedData : this.storeData;
        this.rejectedData = Data.filter(x => x[element.item] && x[element.item].toString().toLowerCase().indexOf(String(this.filterDataModel[element.item]).toLowerCase()) !== -1);
        counter++;
      }
    });
    this.rejectedData = counter === 0 ? this.storeData : this.rejectedData;
  }
  // ******** Create Receipt ******* //
  CreateReceipt(createReceiptModel, uploadpaymentReceipt, createReceiptform, Input) {
    this.isLoading = true;
    let uploadpayReceipt = [];
    if (Input === 'CreateReceipt') {
      if (uploadpaymentReceipt !== null && uploadpaymentReceipt.length > 1) {
        let test = uploadpaymentReceipt.length;
        uploadpayReceipt.push(uploadpaymentReceipt[test - 1]);
      } else {
        uploadpayReceipt = uploadpaymentReceipt;
      }

      createReceiptModel['customerName'] = this.StoreDetails.length > 0 && this.StoreDetails[0]['CustomerName'] ? this.StoreDetails[0]['CustomerName'] : null;
      if (this.legacyDetails['LegalName'] || this.legacyDetails['address']) {
        createReceiptModel['LegalName'] = this.legacyDetails && this.legacyDetails !== null && this.legacyDetails['LegalName'] ? this.legacyDetails['LegalName'] : null;
        createReceiptModel['address'] = this.legacyDetails && this.legacyDetails !== null && this.legacyDetails['address'] ? this.legacyDetails['address'] : null;
      }
    }
    this.createReceiptSubscription = this.paymentReceiptService.createReceipt(this.loggedInuserDetails, createReceiptModel, uploadpayReceipt).subscribe((response) => {
      switch (Input) {
        case 'Verify':
          if (response && response["data"] && response["data"][0].VarificationStatus === 'Verified') {
            this.snackBar.open("Verified successfully", null, { duration: 3000, panelClass: ['blue-snackbar'] });
            this.paymentScheduleDetails(this.storeId);
          }
          else {
            this.snackBar.open("Failed to verify", null, { duration: 3000, panelClass: ['red-snackbar'] });
          }
          this.ConfirmationModal.hide();
          break;
        case 'CreateReceipt':
          if (response && response['successful']) {
            this.snackBar.open("Receipt Submitted Successfully", null, { duration: 3000, panelClass: ['blue-snackbar'] });
            this.disableBtn = true;
            this.createReceiptModel = [];
            this.uploadpaymentReceipt = [];
            this.isAvailable = false;
            this.createReceiptModel.ImageUrl = null;
            createReceiptform.form.markAsPristine();
            createReceiptform.form.markAsUntouched();
            this.showtextField = false;
          } else {
            this.snackBar.open("Failed to submit", null, { duration: 3000, panelClass: ['red-snackbar'] });
          }
          break;
      }
      this.isLoading = false;
    });
  }
  //************* update rejected receipt of accounting  **************//
  UpdateReceipt(createReceiptform, uploadpaymentReceipt) {
    let uploadpayReceipt = [];
    if (uploadpaymentReceipt !== null && uploadpaymentReceipt.length > 1) {
      let test = uploadpaymentReceipt.length;
      uploadpayReceipt.push(uploadpaymentReceipt[test - 1]);
    } else {
      uploadpayReceipt = uploadpaymentReceipt;
    }
    this.createReceiptSubscription = this.paymentReceiptService.UpdateReceiptdata(this.loggedInuserDetails, this.createReceiptModel, uploadpayReceipt).subscribe((response) => {
      if (response && response['successful']) {
        this.snackBar.open("Receipt Updated Successfully", null, { duration: 3000, panelClass: ['blue-snackbar'] });
        this.rejectedPaymentDetails();
      } else {
        this.snackBar.open("Failed to update", null, { duration: 3000, panelClass: ['red-snackbar'] });
      }
      this.createReceiptModel = [];
      this.uploadpaymentReceipt = [];
      this.createReceiptModel.ImageUrl = null;
      this.isdisable = false;
      createReceiptform.form.markAsPristine();
      createReceiptform.form.markAsUntouched();
    });
  }
  //  ***** if other option is selected **** //
  selectedBank(BankName) {
    this.showtextField = BankName === 'Others' ? true : false;
  }
  openPopup(PaymentSchedule, Input) {
    this.storeDetails = PaymentSchedule ? PaymentSchedule : [];
    this.ConfirmationModal.show();
  }
  //******************* Get Payment schedule details by Order Id ****************//
  getPaymentScheduleGrid(OrderId) {
    this.StoreDetails = this.showOrderDetails && this.showOrderDetails.length > 0 ? this.showOrderDetails.filter(x => x['OrderId'] === Number(OrderId)).map(data => { return { CustomerName: data.CustomerName, ProjectId: data.ProjectId, OrderId: data.OrderId } }) : null;
    this.orderService.GetPaymentScheduleDetails(this.loggedInuserDetails, OrderId, 1).subscribe((response) => {      
      this.paymentSchedules = response['data'][0] ? response['data'][0] : [];
      this.disableBtn = false;
      this.createReceiptModel.PaidAgainstDue = 0;
    });
    //******************* Get legal entity name data ****************//
    this.createReceiptModel['LegalName'] = '';
    this.createReceiptModel['address'] = '';
    this.paymentReceiptService.GetLegalDetails(this.loggedInuserDetails, this.StoreDetails[0]['ProjectId']).subscribe((response) => {
      if (response && response['data'] && response['data'][0]) {
        this.legacyDetails = response["data"][0];
        this.createReceiptModel['LegalName'] = this.legacyDetails['LegalName'] ? this.legacyDetails['LegalName'] : '';
        this.createReceiptModel['address'] = this.legacyDetails['address'] ? this.legacyDetails['address'] : '';
        this.isAvailable = true;
      }
      else {
        this.isAvailable = false;
      }
    });
    this.createReceiptModel.PSId = '';
    this.createReceiptModel.ReceiptDate = '';
    this.createReceiptModel.PayBy = '';
    this.createReceiptModel.BankName = '';
    this.createReceiptModel.Branch = '';
    this.createReceiptModel.ChequeDate = '';
    this.createReceiptModel.ChequeNumber = '';
    this.createReceiptModel.PaidAgainstDue = '0';
    this.createReceiptModel.ServiceTax = '0';
    this.createReceiptModel.Infra = '0';
    this.createReceiptModel.Remark = '';
    this.uploadpaymentReceipt = [];

  }
  confirmation(Input) {
    switch (Input) {
      case 'yes':
        this.CreateReceipt(this.storeDetails, null, null, 'Verify');
        break;
      case 'no':
        this.storeDetails = [];
        this.ConfirmationModal.hide();
        break;
    }
  }
  //******************* calling numberToWord method**************//
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

  //--------To generate PDF and Print For each Receipt Id-------//
  download(PaymentSchedule) {
    this.receiptPdfService.download(PaymentSchedule, []);
  }
  //******* Get PSId and Total Amount ********//
  getPSData(PSId) {
    if (PSId && PSId !== null && PSId !== "" && PSId !== "0" && PSId !== 'Others') {
      let paymentDetails = this.paymentSchedules.filter(x => x.PSId == PSId);

      this.createReceiptModel.TotalDemandRaised = paymentDetails[0]['TotalDemandRaised'] || 0;
      this.createReceiptModel.TotalAmountwithoutGSTInfra = paymentDetails[0]['TotalAmountwithoutGSTInfra'] || 0;
      this.createReceiptModel.TaxReceived = paymentDetails[0]['TaxReceived'] || 0;
      this.createReceiptModel.TotalGstReceiptAmount = paymentDetails[0]['TotalGstReceiptAmount'] || 0;
      this.createReceiptModel.InfraCharges = paymentDetails[0]['Infra'] || 0;
      this.createReceiptModel.TotalInfraReceiptAmount = paymentDetails[0]['TotalInfraReceiptAmount'] || 0;
      this.createReceiptModel.Psidcount = paymentDetails[0]['Psidcount'];
      this.createReceiptModel.AdvanceInfraPaidAmount = paymentDetails[0]['AdvanceInfraPaidAmount'] || 0;
      this.createReceiptModel.AdvanceGSTPaidAmount = paymentDetails[0]['AdvanceGSTPaidAmount'] || 0;
      this.createReceiptModel.remainingGSTAmount = this.createReceiptModel.TaxReceived - this.createReceiptModel.TotalGstReceiptAmount;
      this.createReceiptModel.remainingInfraAmount = this.createReceiptModel.InfraCharges - this.createReceiptModel.TotalInfraReceiptAmount;
      // if (paymentDetails[0]['AdvancePaymentUsed']) {
      //   let AdvancePaymentUsed = paymentDetails[0]['AdvancePaymentUsed'] ? paymentDetails[0]['AdvancePaymentUsed'] : 0;
      //   if (AdvancePaymentUsed >= this.createReceiptModel.remainingGSTAmount) {
      //     this.createReceiptModel.remainingGSTAmount = 0;
      //     this.createReceiptModel.AdvanceGSTPaidAmount = this.createReceiptModel.TaxReceived;
      //     AdvancePaymentUsed = paymentDetails[0]['AdvancePaymentUsed'] - this.createReceiptModel.AdvanceGSTPaidAmount;
      //   } else {
      //     this.createReceiptModel.AdvanceGSTPaidAmount = AdvancePaymentUsed;
      //     this.createReceiptModel.remainingGSTAmount = this.createReceiptModel.remainingGSTAmount - AdvancePaymentUsed;
      //     AdvancePaymentUsed = 0;
      //   }
      //   if (AdvancePaymentUsed >= this.createReceiptModel.remainingInfraAmount) {
      //     this.createReceiptModel.remainingInfraAmount = 0;
      //     this.createReceiptModel.AdvanceInfraPaidAmount = this.createReceiptModel.InfraCharges;
      //   } else {
      //     this.createReceiptModel.AdvanceInfraPaidAmount = AdvancePaymentUsed;
      //     this.createReceiptModel.remainingInfraAmount = this.createReceiptModel.remainingInfraAmount - AdvancePaymentUsed;
      //   }
      // }
      this.createReceiptModel.AdvancePaidAgainstDuePaid = paymentDetails[0]['AdvancePaymentUsed'] - this.createReceiptModel.AdvanceInfraPaidAmount - this.createReceiptModel.AdvanceGSTPaidAmount;
      this.createReceiptModel.AdvancePaidAgainstDuePaid = this.createReceiptModel.AdvancePaidAgainstDuePaid >= 0 ? this.createReceiptModel.AdvancePaidAgainstDuePaid : 0;
      // this.createReceiptModel.remainingRaisedAmount = this.createReceiptModel.TotalDemandRaised - this.createReceiptModel.TotalAmountwithoutGSTInfra - (this.createReceiptModel.Psidcount === 0 ? this.createReceiptModel.AdvancePaidAgainstDuePaid : 0);
      this.createReceiptModel.remainingRaisedAmount = paymentDetails[0].TotalDemandRemaning - this.createReceiptModel.remainingGSTAmount - this.createReceiptModel.remainingInfraAmount;
      this.createReceiptModel.Psidcount !== 0 ? this.createReceiptModel.AdvanceInfraPaidAmount = this.createReceiptModel.AdvanceGSTPaidAmount = this.createReceiptModel.AdvancePaidAgainstDuePaid = 0 : null;
      this.FullgstinfraPaid = this.createReceiptModel.remainingGSTAmount === 0 && this.createReceiptModel.remainingInfraAmount === 0 ? false : true;
    } else {
      this.createReceiptModel.TotalDemandRaised = 0;
      this.createReceiptModel.TotalAmountwithoutGSTInfra = 0;
      this.createReceiptModel.TaxReceived = 0;
      this.createReceiptModel.TotalGstReceiptAmount = 0;
    }
    if (this.createReceiptModel.PaidAgainstDue !== null) {
      this.checkAmount(null);
    }
  }

  //******* Check whether amount is less than actual amount ********//
  checkAmount(Input) {
    if (this.createReceiptModel.PSId && this.createReceiptModel.PSId !== null && this.createReceiptModel.PSId !== "" && this.createReceiptModel.PSId !== 0) {
      this.disableBtn = false;
      switch (Input) {
        case 'AmountPaid':
          if (this.createReceiptModel.PaidAgainstDue > (Number(this.createReceiptModel.remainingRaisedAmount))) {
            this.disableBtn = true;
            this.snackBar.open("Due exceeds than Total Demand !!", null, { duration: 5000, panelClass: ['red-snackbar'] });
          } else {
            this.disableadvPaymentField = (Number(this.createReceiptModel.PaidAgainstDue) === Number(this.createReceiptModel.remainingRaisedAmount)) ? false : true;
            this.createReceiptModel.AdvancePayment = 0;
          }
          break;
        case 'GstPaid':
          if ((Number(this.createReceiptModel.TaxReceived) - Number(this.createReceiptModel.TotalGstReceiptAmount)) < Number(this.createReceiptModel.ServiceTax) + Number(this.createReceiptModel.AdvanceGSTPaidAmount)) {
            this.disableBtn = true;
            this.snackBar.open("Due exceeds than Total GST Raised !!", null, { duration: 5000, panelClass: ['red-snackbar'] });
          } else {
            this.FullgstinfraPaid = this.createReceiptModel.remainingGSTAmount === 0 && this.createReceiptModel.remainingInfraAmount === 0 ? false :
              (Number(this.createReceiptModel.remainingGSTAmount) === Number(this.createReceiptModel.ServiceTax) && Number(this.createReceiptModel.remainingInfraAmount) === Number(this.createReceiptModel.Infra) ? false : true);
          }
          break;
        case 'InfraPaid':
          if ((Number(this.createReceiptModel.InfraCharges) - Number(this.createReceiptModel.TotalInfraReceiptAmount)) < Number(this.createReceiptModel.Infra) + Number(this.createReceiptModel.AdvanceInfraPaidAmount)) {
            this.disableBtn = true;
            this.snackBar.open("Due exceeds than Total Infra Raised !!", null, { duration: 5000, panelClass: ['red-snackbar'] });
          } else {
            this.FullgstinfraPaid = this.createReceiptModel.remainingGSTAmount === 0 && this.createReceiptModel.remainingInfraAmount === 0 ? false :
              (Number(this.createReceiptModel.remainingGSTAmount) === Number(this.createReceiptModel.ServiceTax) && Number(this.createReceiptModel.remainingInfraAmount) === Number(this.createReceiptModel.Infra) ? false : true);
          }
          break;
        default:
          this.disableBtn = false;
          break;
      }
    } else {
      this.disableBtn = false;
    }
  }
  //******* open search form ********//
  searchData() {
    this.createReceipt = false;
  }
  //******* open create form ********//
  createData() {
    this.createReceiptModel = [];
    this.createReceiptModel.ImageUrl = null
    this.createReceipt = true;
    this.isAvailable = false;
    this.isdisable = false;
  }

  ngOnDestroy() {
    this.createReceiptSubscription ? this.createReceiptSubscription.unsubscribe() : null;
    this.GetPaymentScheduleSubscription ? this.GetPaymentScheduleSubscription.unsubscribe() : null;
    this.getSearchDetailsSubscribtion ? this.getSearchDetailsSubscribtion.unsubscribe() : null;
  }

}