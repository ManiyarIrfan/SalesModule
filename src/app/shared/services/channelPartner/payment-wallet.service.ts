import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PaymentWalletService {

  constructor(private http: HttpClient) { }

  actualBrokarage = (user) => {
    const url = `${environment.empApiUrl}api/TRUPay/GetVirtualWallet/UserId?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}`;
    return this.http.get(url).pipe(map(x => x));
  }

  payout = (user, paymentModel) => {
    let data = {
      fund_account_id: paymentModel.fundAccount ? paymentModel.fundAccount : null,
      amount: paymentModel.withdrawalAmt ? paymentModel.withdrawalAmt : null,
      currency: paymentModel.currencyType ? paymentModel.currencyType : null,
      mode: paymentModel.paymentMode ? paymentModel.paymentMode : null,
      queue_if_low_balance: paymentModel.inQueue ? paymentModel.inQueue : null,
      agreementAmount: paymentModel.actualAmount ? paymentModel.actualAmount : null,
      registrationNo: paymentModel.agreementNo ? paymentModel.agreementNo : null,
      truPayActualId: paymentModel.TruPayActualId ? paymentModel.TruPayActualId : null,
      id: user.UserId,
    }
    // let url = `${environment.TestempApiUrl}api/TRUPay/Payout/UserId,EntityId,UserType?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}`;
    let url = `${environment.empApiUrl}api/TRUPay/Payout/UserId,EntityId,UserType?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}`;
    return this.http.post(url, data).pipe(map(x => x), take(1));
  }

  checkAgreementnumber = (user, agreementNo) => {
    const url = `${environment.empApiUrl}api/TRUPay/GetAmountFromRegistrationNo/UserId?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}&RegistrationNo=${agreementNo}`;
    return this.http.get(url).pipe(map(x => x));
  }

  viewTransferHistory = (user, funAcc) => {
    const url = `${environment.empApiUrl}api/TRUPay/RazorpayShowPayoutHistory/UserId,EntityId,UserType,FundId?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}&FundId=${funAcc}`;
    return this.http.get(url).pipe(map(x => x));
    // const url = `${environment.empApiUrl}api/TRUPay/GetWithdrawalSummary/UserId?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}`;
    // return this.http.get(url).pipe(map(x => x));
  }

  createRazorpayAcc = (user, cpDetails) => {
    let data = {
      id: user.UserId,
      name: cpDetails.Name ? cpDetails.Name : null,
      email: cpDetails.Email ? cpDetails.Email : null,
      contactNumber: cpDetails.MobileNo ? cpDetails.MobileNo : null,
      type: user.UserType,
    }
    let url = `${environment.empApiUrl}api/TRUPay/RazorpayCreateContact/UserId,EntityId,UserType?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}`;
    return this.http.post(url, data).pipe(map(x => x), take(1));
  }
  createRazorpayfundAcc = (user, cpDetails) => {
    let data = {
      id: user.UserId,
      razorpayContactId: cpDetails.ContactId ? cpDetails.ContactId : null,
      accountType: cpDetails.AccountType ? cpDetails.AccountType : null,
      bankAccountNumber: cpDetails.AccountNo ? cpDetails.AccountNo : null,
      ifsc: cpDetails.IFSC ? cpDetails.IFSC : null,
      bankName: cpDetails.BankName ? cpDetails.BankName : null,
      vpAddress: cpDetails.UPICode ? cpDetails.UPICode : null,
      name: cpDetails.Name ? cpDetails.Name : null
    }
    let url = `${environment.empApiUrl}api/TRUPay/RazorpayCreateFundAcc/UserId,EntityId,UserType?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}`;
    return this.http.post(url, data).pipe(map(x => x), take(1));
  }
  bankDetailsonFunAcc = (user, funAcc) => {
    const url = `${environment.empApiUrl}api/TRUPay/RazorpayShowFundAcc/UserId,EntityId,UserType,FundId?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}&FundId=${funAcc ? funAcc : null}`;
    return this.http.get(url).pipe(map(x => x));
  }
}
