import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CpPaymentStatusService {
  constructor(private http: HttpClient) { }

  GetChannelPartnerDetails = (user) => {
    const url = `${environment.channelApiUrl}api/ChannelPartners/GetById/UserId,EntityId,UserType?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}&TenantId=${user.TenantId}`;
    return this.http.get(url).pipe(map(x => x));
  }
  GetOrderDetailByBrokerId = (user) => {
    const url = `${environment.empApiUrl}api/PaymentStatus/OrderDetails/GetByChannelPartnerId/UserId,EntityId,UserType?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}`;
    return this.http.get(url).pipe(map(x => x));
  }
  GetPaymentStatusDetailByOrderId = (user, details) => {
    const url = `${environment.empApiUrl}api/PaymentStatus/GetByOrderId/UserId,EntityId,UserType,OrderId?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}&OrderId=${details.OrderId}`;
    return this.http.get(url).pipe(map(x => x));
  }
  InsertPaymentStatus = (paymentStatusModel, sessionModel, uploadFileList, user) => {
    let data = {
      paymentStatusModelInsert: {
        Id: user.UserId,
        UserType: user.UserType,
        entityId: user.EntityId,
        orderid: sessionModel.OrderId,
        invoiceno: paymentStatusModel.InVoiceNo,
        invoicedate: paymentStatusModel.InvoiceDate,
        paymentmade: paymentStatusModel.PaymentMade,
        amountcr: paymentStatusModel.AmountCr,
        amountdr: paymentStatusModel.AmountDr,
        chequeno: paymentStatusModel.ChequeNo,
        dateofcheque: paymentStatusModel.DateOfCheque,
      },
      Files: uploadFileList,
    }
    let url = `${environment.empApiUrl}api/PaymentStatus/Insert/UserId,EntityId,UserType?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}`;
    return this.http.post(url, data).pipe(map(x => x), take(1));
  }

}
