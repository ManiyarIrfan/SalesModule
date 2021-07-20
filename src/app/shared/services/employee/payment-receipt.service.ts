import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PaymentReceiptService {

  constructor(private http: HttpClient) { }

  GetPaymentSchedule = (user, orderDetails) => {
    const url = `${environment.apiUrl}api/PaymentSchedule/GetByOrderId/UserId,EntityId,UserType,OrderId?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}&OrderId=${orderDetails}`;
    return this.http.get(url).pipe(map(x => x));
  }
  GetRejectedPayment = (user, input) => {
    let body = {
      entityId: user.EntityId ? user.EntityId : null,
      userType: user.UserType ? user.UserType : null,
      tenantId: user.TenantId ? user.TenantId : null,
      input
    }
    const url = `${environment.empApiUrl}api/CustomerOrder/GetOrders/UserId,EntityId,UserType?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}&TenantId=${user.TenantId}`;
    return this.http.post(url, body).pipe(map(x => x), take(1));
  }
  GetLegalDetails = (user, ProjectId) => {
    const url = `${environment.empApiUrl}api/CustomerReceipt/GetLegalDetails/UserId,EntityId,UserType?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}&TenantId=${user.TenantId}&phase1ProjectId=${ProjectId}`;
    return this.http.get(url).pipe(map(x => x));
  }
  createReceipt = (user, createReceiptModel, uploadpaymentReceipt) => {
    let body = {
      customerReceiptInsert: {
        orderId: createReceiptModel.OrderId || null,
        receiptDate: createReceiptModel.ReceiptDate || null,
        documentNo: createReceiptModel.DocumentNo || null,
        documentType: createReceiptModel.DocumentType || null,
        paidAgainstDue: createReceiptModel.PaidAgainstDue || null,
        chequeDate: createReceiptModel.ChequeDate || null,
        chequeNumber: createReceiptModel.ChequeNumber || null,
        payBy: createReceiptModel.PayBy || null,
        serviceTax: createReceiptModel.ServiceTax || null,
        bankName: createReceiptModel.BankName || null,
        pSId: createReceiptModel.PSId || null,
        branch: createReceiptModel.Branch || null,
        installmentNo: createReceiptModel.InstallmentNo || null,
        status: createReceiptModel.Status || null,
        remark: createReceiptModel.Remark || null,
        id: user.UserId,
        customerName: createReceiptModel.customerName || null,
        legalEntityName: createReceiptModel.LegalName || null,
        LegalEntityAddress: createReceiptModel.address || null,
        receiptNo: createReceiptModel.ReceiptNo || null,
        Infra: createReceiptModel.Infra || null,
        advancePayment: createReceiptModel.AdvancePayment || null,
        advanceGSTPaid: createReceiptModel.Psidcount === 0 ? createReceiptModel.AdvanceGSTPaidAmount : 0,
        advanceInfraPaid: createReceiptModel.Psidcount === 0 ? createReceiptModel.AdvanceInfraPaidAmount : 0,
        advancePaidAgainstDuePaid: createReceiptModel.Psidcount === 0 ? createReceiptModel.AdvancePaidAgainstDuePaid : 0
      },
      file: uploadpaymentReceipt
    }
    const url = `${environment.empApiUrl}api/CustomerReceipt/InsertPaymentReceipt/UserId,EntityId,UserType,DeviceDetails?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}&DeviceDetails=${user.DeviceDetails}`;
    return this.http.post(url, body).pipe(map(x => x), take(1));
  }
  UpdateReceiptdata(user, createReceiptModel, uploadpaymentReceipt) {
    let body = {
      customerReceiptModelUpdate: {
        orderId: createReceiptModel.StoreOrderID ? createReceiptModel.StoreOrderID : null,
        receiptDate: createReceiptModel.ReceiptDate ? createReceiptModel.ReceiptDate : null,
        paidAgainstDue: createReceiptModel.PaidAgainstDue ? createReceiptModel.PaidAgainstDue : null,
        chequeDate: createReceiptModel.ChequeDate ? createReceiptModel.ChequeDate : null,
        chequeNumber: createReceiptModel.ChequeNumber ? createReceiptModel.ChequeNumber : null,
        payBy: createReceiptModel.PayBy ? createReceiptModel.PayBy : null,
        serviceTax: createReceiptModel.ServiceTax ? createReceiptModel.ServiceTax : null,
        bankName: createReceiptModel.BankName ? createReceiptModel.BankName : null,
        pSId: createReceiptModel.StorePSID ? createReceiptModel.StorePSID : null,
        branch: createReceiptModel.Branch ? createReceiptModel.Branch : null,
        installmentNo: createReceiptModel.InstallmentNo ? createReceiptModel.InstallmentNo : null,
        remark: createReceiptModel.Remark ? createReceiptModel.Remark : null,
        id: user.UserId,
        receiptNo: createReceiptModel.ReceiptNo ? createReceiptModel.ReceiptNo : null,
        documentNo: createReceiptModel.ImageId ? createReceiptModel.ImageId : null,
        Infra: createReceiptModel.Infra ? createReceiptModel.Infra : null
      },
      file: uploadpaymentReceipt
    }
    const url = `${environment.empApiUrl}api/CustomerReceipt/Update/UserId,EntityId,UserType,DeviceDetails?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}&TenantId=${user.TenantId}&DeviceDetails=${user.DeviceDetails}`;
    return this.http.put(url, body).pipe(map(x => x), take(1));
  }

}
