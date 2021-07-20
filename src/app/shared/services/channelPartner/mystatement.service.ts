import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MystatementService {

  constructor(private http: HttpClient) { }

  GetMyStatement = (user) => {
    const url =  `${environment.channelApiUrl}api/ChannelPartner/GetMyStatement/UserId,EntityId,UserType?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}`;
    return this.http.get(url).pipe(map(x => x));
  }

  cpInvoiceUpload = (user, invoiceDetails, importCpInvoice) => {
    let data = {
      invoiceUpdate: {
        orderId: invoiceDetails.OrderId,
        entityId: user.EntityId,
        userType: user.UserType
      },
      file: importCpInvoice,
      deleteFileUrl: invoiceDetails.Invoice,
      dbImageUrlList: invoiceDetails.Invoice
    } 
    let url = `${environment.channelApiUrl}api/ChannelPartner/UploadOrderInvoice/UserId,EntityId,UserType?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}`;
    return this.http.post(url, data).pipe(map(x => x), take(1));
  }
 
}
