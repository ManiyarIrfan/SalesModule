import { Component, OnInit, ViewChild, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap';
import { OrderService } from 'src/app/shared/services/employee/order.service';
import { SharedService } from 'src/app/shared/services/shared/shared.service';

@Component({
  selector: 'tru-emp-financial-status',
  templateUrl: './emp-financial-status.component.html',
  styleUrls: ['./emp-financial-status.component.scss']
})
export class EmpFinancialStatusComponent implements OnInit {
  @Output() lengthEvent = new EventEmitter<number>();
  public installmentNumber: number = 0;
  @ViewChild('financialModal', { static: false }) public financialModal: ModalDirective;
  @ViewChild('showFinancialStatusImageModal', { static: false }) public showFinancialStatusImageModal: ModalDirective;
  public financialStatusInsertUnsuccessfully: string = "";
  public financialStatusInsertSuccessfully: string = "";
  public isEditReceipt: boolean = false;
  public financialModel: any = {};
  public NoDataFoundMessage: string = "";
  public GetTotalAmountPaid: any = [];
  public GetTotalDemandRaised: any = [];
  public paymentScheduleFields: any = [];
  public showGrid: boolean;
  public isLoading: boolean = false;
  public loggedInuserDetails: any;
  public orderModel: any = {};
  public paymentScheduleModel: any = {};
  public orderID: any;
  public paymentReciept: any = {};
  public fileToUpload: File;
  public uploadFiles: FormControl;
  public getFinanceStatus: boolean = false;
  public isImageAvailable: boolean;
  public imageNotAvailable: string;
  public sumTotalDemandRaised: number = 0;
  public totalDemandRaised: number = 0;

  FinancialStatusForm: FormGroup;
  OrderId: FormControl;
  installmentNo: FormControl;
  PayAgainst1: FormControl;
  Status1: FormControl;
  ReceiptDate: FormControl;
  DocumentNo: FormControl;
  DocumentType: FormControl;
  ChequeDate: FormControl;
  ChequeNumber: FormControl;
  BankName: FormControl;
  Branch: FormControl;
  PayBy: FormControl;
  ServiceTax: FormControl;
  PaidAgainstDue: FormControl;
  imageUrlPath: any;
  images: any;

  constructor(public router: Router, private orderService: OrderService, private sharedService: SharedService) { }

  ngOnInit() {
    if (localStorage.getItem('LoggedinUser')) {
      this.isLoading = true;
      this.loggedInuserDetails = JSON.parse(localStorage.getItem('LoggedinUser'));
      this.showGrid = true;
    } else {
      this.router.navigate(['/login']);
    }
    this.sharedService.changeOrderListener.subscribe((Order) => {
      this.orderModel.OrderId = Order.OrderId;
      this.orderID = Order.OrderId;
      this.getPaymentScheduleGrid();
    });
    this.sharedService.changePaymentListener.subscribe((payment) => {
      if (this.loggedInuserDetails) {
        this.getPaymentScheduleGrid();
      }
    });
    this.formValidation();
    this.createFormInput();
  }
  //-------Financial Receipt Insert Input Validation-------//
  formValidation = () => {
    this.OrderId = new FormControl({ disabled: true }, Validators.required);
    this.installmentNo = new FormControl({ disabled: true }, Validators.required);
    this.PayAgainst1 = new FormControl({ disabled: true }, Validators.required);
    this.Status1 = new FormControl({ disabled: true }, [Validators.pattern("[a-zA-Z0-9 ]+"), Validators.required]);
    this.ReceiptDate = new FormControl('', [Validators.pattern("(?:2018|2019|(?:202)[0-9]{1}|(?:203)[0-9]{1}|(?:204)[0-9]{1})-(?:(?:0[1-9]|1[0-2])-(?:0[1-9]|1[0-9]|2[0-9])|(?:(?!02)(?:0[1-9]|1[0-2])-(?:30))|(?:(?:0[13578]|1[02])-31))"), Validators.required]);
    this.DocumentNo = new FormControl('', Validators.pattern("[a-zA-Z0-9 ]+"));
    this.DocumentType = new FormControl('', Validators.pattern("[a-zA-Z0-9 ]+"));
    this.ChequeDate = new FormControl('', Validators.pattern("(?:2018|2019|(?:202)[0-9]{1}|(?:203)[0-9]{1}|(?:204)[0-9]{1})-(?:(?:0[1-9]|1[0-2])-(?:0[1-9]|1[0-9]|2[0-9])|(?:(?!02)(?:0[1-9]|1[0-2])-(?:30))|(?:(?:0[13578]|1[02])-31))"));
    this.ChequeNumber = new FormControl('', Validators.pattern("[0-9 ]+"));
    this.BankName = new FormControl('', Validators.pattern("[a-zA-Z0-9 ]+"));
    this.Branch = new FormControl('', Validators.pattern("[a-zA-Z0-9 ]+"));
    this.PayBy = new FormControl('', Validators.pattern("[a-zA-Z ]+"));
    this.ServiceTax = new FormControl('', Validators.pattern("[0-9 ]+"));
    this.PaidAgainstDue = new FormControl('', [Validators.pattern("[0-9 ]+"), Validators.required]);
    this.uploadFiles = new FormControl('');
  }
  //-------End-------//
  //-------FinancialStatusForm FormGroup for Insert Financial Receipt-------//
  createFormInput() {
    this.FinancialStatusForm = new FormGroup({
      OrderId: this.OrderId,
      installmentNo: this.installmentNo,
      PayAgainst1: this.PayAgainst1,
      Status1: this.Status1,
      ReceiptDate: this.ReceiptDate,
      DocumentNo: this.DocumentNo,
      DocumentType: this.DocumentType,
      ChequeDate: this.ChequeDate,
      ChequeNumber: this.ChequeNumber,
      BankName: this.BankName,
      Branch: this.Branch,
      PayBy: this.PayBy,
      ServiceTax: this.ServiceTax,
      PaidAgainstDue: this.PaidAgainstDue,
      uploadFiles: this.uploadFiles
    });
  }
  //-------End-------//
  getPaymentScheduleGrid() {
    this.installmentNumber = this.paymentScheduleFields.length;
    this.paymentScheduleModel.InstallmentNo = this.paymentScheduleFields.length + 1;
    this.lengthEvent.emit(this.paymentScheduleModel.InstallmentNo);
    this.orderService.GetPaymentScheduleDetails(this.loggedInuserDetails, this.orderID, 0).subscribe((response) => {
      if (response['exception']) {
        this.NoDataFoundMessage = "The Payment Schedule data is not found, please add the Installment as required.";
        this.isLoading = false;
      } else {
        if (response['data'][0] && response['data'][1]) {
          this.paymentScheduleFields = response['data'][0];
          this.GetTotalAmountPaid = response['data'][1];
          this.GetTotalDemandRaised = response['data'][1];
          this.NoDataFoundMessage = "";
          this.showGrid = true;
          this.isLoading = false;
          this.sumTotalDemandRaised = 0;
          this.paymentScheduleFields.forEach((item, index) => {
            this.totalDemandRaised = this.paymentScheduleFields[index].TotalDemandRaised;
            this.sumTotalDemandRaised += this.totalDemandRaised;
          })
          this.sharedService.shareFinancialDetails(this.paymentScheduleFields);
        }
      }
    });
  }
  //-------prepareFormData for Insert Financial Receipt Model Binding-------//
  prepareFormData(): FormData {
    const financialModel = this.FinancialStatusForm.value;
    let formData = new FormData();
    formData.append("OrderId", this.orderID);
    formData.append("ReceiptDate", financialModel.ReceiptDate);
    formData.append("DocumentNo", financialModel.DocumentNo);
    formData.append("DocumentType", financialModel.DocumentType);
    formData.append("PaidAgainstDue", financialModel.PaidAgainstDue);
    formData.append("ChequeDate", financialModel.ChequeDate);
    formData.append("ChequeNumber", financialModel.ChequeNumber);
    formData.append("PayBy", financialModel.PayBy);
    formData.append("ServiceTax", financialModel.ServiceTax);
    formData.append("BankName", financialModel.BankName);
    formData.append("PayAgainst", this.paymentReciept.PayAgainst);
    formData.append("Branch", financialModel.Branch);
    formData.append("InstallmentNo", this.paymentReciept.InstallmentNo);
    formData.append("Status", this.paymentReciept.Status);
    formData.append("uploadFiles", this.fileToUpload);
    return formData;
  }
  //-------End-------//
  OnInsertCreateReceiptBttnClick = (FinancialStatusForm) => {
    this.orderService.InsertFinancialStatusDetails(this.prepareFormData(), this.loggedInuserDetails).subscribe((response) => {
      if (response && response['successful']) {
        this.financialStatusInsertSuccessfully = "Financial Status Submitted Successfully.";
        this.getPaymentScheduleGrid();
      } else {
        this.financialStatusInsertUnsuccessfully = "Financial Status Submittion Failed.";
        this.FinancialStatusForm.reset();
      }
      this.FinancialStatusForm.reset();
      this.FinancialStatusForm.markAsPristine();
      this.FinancialStatusForm.markAsUntouched();
      setTimeout(() => {
        this.financialStatusInsertSuccessfully = "";
        this.financialStatusInsertUnsuccessfully = "";
      }, 5000);
    });
    //document.addEventHandler('scroll', function (e) { e.preventDefault(); }, { passive: true });
    this.showModalCreateReceipt(FinancialStatusForm);
  }
  GetFinancialStatusReceipt = (payment) => {
    if (this.loggedInuserDetails) {
      this.orderService.GetFinancialStatusDetails(this.loggedInuserDetails, this.orderModel, payment).subscribe((response) => {
        if (response["data"]) {
          this.financialModel = response["data"][0];
          this.getFinacialReciept(payment, this.financialModel);
          this.paymentScheduleModel = payment;
          this.isEditReceipt = true;
        }
      });
    }
  }
  //-------Get Financial Receipt Enable and Disable-------//
  getFinacialReciept = (payment, financialModal) => {
    this.FinancialStatusForm.controls["OrderId"].setValue(financialModal.OrderId);
    this.FinancialStatusForm.controls["installmentNo"].setValue(payment.InstallmentNo);
    this.FinancialStatusForm.controls["PayAgainst1"].setValue(financialModal.PayAgainst);
    this.FinancialStatusForm.controls["Status1"].setValue(financialModal.Status);
    this.FinancialStatusForm.controls["ReceiptDate"].setValue(financialModal.ReceiptDate);
    this.FinancialStatusForm.controls["DocumentNo"].setValue(financialModal.DocumentNo);
    this.FinancialStatusForm.controls["DocumentType"].setValue(financialModal.DocumentType);
    this.FinancialStatusForm.controls["ChequeDate"].setValue(financialModal.ChequeDate);
    this.FinancialStatusForm.controls["ChequeNumber"].setValue(financialModal.ChequeNumber);
    this.FinancialStatusForm.controls["BankName"].setValue(financialModal.BankName);
    this.FinancialStatusForm.controls["Branch"].setValue(financialModal.Branch);
    this.FinancialStatusForm.controls["PayBy"].setValue(financialModal.PayBy);
    this.FinancialStatusForm.controls["ServiceTax"].setValue(financialModal.ServiceTax);
    this.FinancialStatusForm.controls["PaidAgainstDue"].setValue(financialModal.PaidAgainstDue);
    this.FinancialStatusForm.controls["OrderId"].disable();
    this.FinancialStatusForm.controls["installmentNo"].disable();
    this.FinancialStatusForm.controls["PayAgainst1"].disable();
    this.FinancialStatusForm.controls["Status1"].disable();
    this.FinancialStatusForm.controls["ReceiptDate"].disable();
    this.FinancialStatusForm.controls["DocumentNo"].disable();
    this.FinancialStatusForm.controls["DocumentType"].disable();
    this.FinancialStatusForm.controls["ChequeDate"].disable();
    this.FinancialStatusForm.controls["ChequeNumber"].disable();
    this.FinancialStatusForm.controls["BankName"].disable();
    this.FinancialStatusForm.controls["Branch"].disable();
    this.FinancialStatusForm.controls["PayBy"].disable();
    this.FinancialStatusForm.controls["ServiceTax"].disable();
    this.FinancialStatusForm.controls["PaidAgainstDue"].disable();
    this.imageUrlPath = financialModal.ImageUrl;
    this.financialModal.show();
    this.getFinanceStatus = true;
  }
  //-------End-------//
  //-------Insert Financial Receipt Enable and Disable-------//
  showModalCreateReceipt = (payment) => {
    this.FinancialStatusForm.controls["OrderId"].setValue(this.orderID);
    this.FinancialStatusForm.controls["installmentNo"].setValue(payment.InstallmentNo);
    this.FinancialStatusForm.controls["PayAgainst1"].setValue(payment.PayAgainst);
    this.FinancialStatusForm.controls["Status1"].setValue(payment.Status);
    this.FinancialStatusForm.controls["ReceiptDate"].setValue(payment.ReceiptDate);
    this.FinancialStatusForm.controls["DocumentNo"].setValue(payment.DocumentNo);
    this.FinancialStatusForm.controls["DocumentType"].setValue(payment.DocumentType);
    this.FinancialStatusForm.controls["ChequeDate"].setValue(payment.ChequeDate);
    this.FinancialStatusForm.controls["ChequeNumber"].setValue(payment.ChequeNumber);
    this.FinancialStatusForm.controls["BankName"].setValue(payment.BankName);
    this.FinancialStatusForm.controls["Branch"].setValue(payment.Branch);
    this.FinancialStatusForm.controls["PayBy"].setValue(payment.PayBy);
    this.FinancialStatusForm.controls["ServiceTax"].setValue(payment.ServiceTax);
    this.FinancialStatusForm.controls["PaidAgainstDue"].setValue(payment.PaidAgainstDue);
    this.imageUrlPath = payment.ImageUrl;
    this.FinancialStatusForm.controls["OrderId"].disable();
    this.FinancialStatusForm.controls["installmentNo"].disable();
    this.FinancialStatusForm.controls["PayAgainst1"].disable();
    this.FinancialStatusForm.controls["Status1"].disable();
    this.FinancialStatusForm.controls["ReceiptDate"].enable();
    this.FinancialStatusForm.controls["DocumentNo"].enable();
    this.FinancialStatusForm.controls["DocumentType"].enable();
    this.FinancialStatusForm.controls["ChequeDate"].enable();
    this.FinancialStatusForm.controls["ChequeNumber"].enable();
    this.FinancialStatusForm.controls["BankName"].enable();
    this.FinancialStatusForm.controls["Branch"].enable();
    this.FinancialStatusForm.controls["PayBy"].enable();
    this.FinancialStatusForm.controls["ServiceTax"].enable();
    this.FinancialStatusForm.controls["PaidAgainstDue"].enable();
    this.paymentReciept = payment;
    this.financialModal.show();
    this.getFinanceStatus = false;
  }
  //-------End-------//
  viewImage = () => {
    this.showFinancialStatusImageModal.show();
    this.images = this.imageUrlPath;
    if (this.imageUrlPath != null) {
      this.isImageAvailable = true;
    } else {
      this.isImageAvailable = false;
      this.imageNotAvailable = "Image is Not Available.";
    }
  }
  onCloseCreateReceipt = () => {
    this.financialModal.hide();
  }
  fileChange(files: FileList) {
    if (files && files[0]) {
      this.fileToUpload = files[0];
    } else {
      this.fileToUpload = null;
    }
  }
  onClose = () => {
    this.showFinancialStatusImageModal.hide();
  }
}