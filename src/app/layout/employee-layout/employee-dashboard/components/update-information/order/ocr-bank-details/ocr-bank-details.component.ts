import { Component, OnInit, Input, SimpleChanges, OnChanges } from '@angular/core';
import { OrderService } from 'src/app/shared/services/employee/order.service';
import { MatSnackBar } from '@angular/material';
@Component({
  selector: 'app-ocr-bank-details',
  templateUrl: './ocr-bank-details.component.html',
  styleUrls: ['./ocr-bank-details.component.scss']
})
export class OcrBankDetailsComponent implements OnInit, OnChanges {
  @Input() orderDetails: any = [];
  public loggedInuserDetails: any;
  public orderModel: any;
  public ocrModel: any = [];
  public showSuccessfullMessage: string = '';
  public showUnsuccessfullMessage: string = '';
  public SourceInfo: any = [
    { key: "Self", value: "Self" },
    { key: "Bank", value: "Bank" },
    { key: "Self + Bank", value: "Self + Bank" }];
  public loanCheckInfo: any = [
    { key: "yes", value: "Yes" },
    { key: "no", value: "No" }];
  public OrderStatusList: any = [
    { key: "Booking Amount Paid", value: "Booking Amount Paid" },
    { key: "Loan Document Pending", value: "Loan Document Pending" },
    { key: "Loan Document Collected", value: "Loan Document Collected" }];
  public bankNames: any = [
    { key: "SBI", value: "SBI" },
    { key: "HDFC", value: "HDFC" },
    { key: "IDBI", value: "IDBI" },
    { key: "ICICI", value: "ICICI" },
    { key: "AXIS", value: "AXIS" },
    { key: "Bank Of India", value: "Bank Of India" },
    { key: "Punjab National Bank", value: "Punjab National Bank" },
    { key: 'Pune Dist Cooperative Bank', value: 'Pune Dist Cooperative Bank' },
    { key: "Others", value: "Others" }];
  public isFieldDisabled: boolean;
  public showDateNotMatchMessage: boolean = false;
  constructor(private orderService: OrderService, private snackBar: MatSnackBar) { }

  ngOnInit() {
    if (localStorage.getItem('LoggedinUser')) {
      this.loggedInuserDetails = JSON.parse(localStorage.getItem('LoggedinUser'));
    }
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.orderDetails && this.orderDetails) {
      if (localStorage.getItem('LoggedinUser')) {
        this.loggedInuserDetails = JSON.parse(localStorage.getItem('LoggedinUser'));
        this.ocrModel = this.orderModel = this.orderDetails;
      }
    }
  }
  onChangeSelect(typeValue) {
    //--------Select Source Of Funding From Dropdown-------//
    switch (typeValue) {
      case 'Bank':
        this.ocrModel.PaymentMilestone = '';
        this.ocrModel.CompanyName = '';
        this.ocrModel.Designation = '';
        break;
      case `Self`:
        this.ocrModel.BankName = '';
        this.ocrModel.BankExecutiveName = '';
        this.ocrModel.LoanSanctionLetter = '';
        this.ocrModel.LoanSanctionDate = '';
        this.ocrModel.NOCIssued = '';
        this.ocrModel.NOCIssuedDate = '';
        break;
    }
    this.MatchDate(this.ocrModel);
  }
  insertOcrDetails = (ocrModel) => {
    let temp = ((Number(ocrModel.SelfPercentage) + Number(ocrModel.BankPercentage)) === 100) ? true : false;
    if (temp) {
      this.orderService.orderOcrDetails(this.loggedInuserDetails, this.orderModel, ocrModel).subscribe((response) => {
        if (response && response['successful']) {
          this.showSuccessfullMessage = "Submitted Successfully";
        } else {
          this.showUnsuccessfullMessage = "Submittion Failed";
        }
        this.showDateNotMatchMessage = false;
        setTimeout(() => {
          this.showSuccessfullMessage = '';
          this.showUnsuccessfullMessage = '';
        }, 5000);
      });
    }
    else {
      this.showFailedBar('self and bank percentage should be 100%');
    }
  }
  MatchDate = (ocrModel) => {
    //--------Show Message If Date doesn't Match-------//
    if (ocrModel.Source === 'Bank' && this.ocrModel.LoanSanctionLetter === 'yes' && this.ocrModel.NOCIssued === 'yes') {
      if (ocrModel.LoanSanctionDate === ocrModel.NOCIssuedDate) {
        this.showDateNotMatchMessage = false;
      } else {
        this.showDateNotMatchMessage = true;
      }
    } else {
      this.showDateNotMatchMessage = false;
    }
  }
  getToday(): string {
    return new Date().toISOString().split('T')[0];
  }
  //------- failed snakbar method -------//
  showFailedBar = (message: string) => {
    this.snackBar.open(message, null, { duration: 7000, panelClass: ['red-snackbar'] });
  }

}
