import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { FileAttachment } from '../../components/file-upload/file-attachment.model';

@Injectable({
  providedIn: 'root'
})
export class WhatsappService {

  constructor(private http: HttpClient) { }
  getWAUsers = (data) => {
    const url = `${environment.empApiUrl}api/WhatsApp/ReceiveGupshupWhatsAppMessage?Input=${data.Input}&Number=${data.Number}`;
    return this.http.get(url).pipe(map(x => x));
  }

  SaveWAmessage = (response, message, source, destination, app, apikey) => {
    // const url = `https://api.gupshup.io/sm/api/v1/msg?apikey=${apiKey} `;
    // let headers = new HttpHeaders();
    // headers.append('Content-Type', 'application/x-www-form-urlencoded');
    // headers.append('apikey', apiKey);
    // const body = {
    //   channel: 'whatsapp',
    //   source: '917834811114',
    //   destination: MobileNo,
    //   ['src.name']: 'trurealty1',
    //   message: message
    // }
    const url = `${environment.empApiUrl}api/WhatsApp/SendGupshupWhatsAppMessageAsync`;
    const body = {
      type3: 'text',
      url2: null,
      filename: null,
      message: message,
      destination: destination,
      source: source,
      app: app,
      key: apikey,
      flow: 'Outbound',
      id: null
    };
    return this.http.post(url, body).pipe(map(x => x));
  }

  SaveMessageWithAttachment = (WhatsappData, Attachurl, filename) => {
    const url = `${environment.empApiUrl}api/WhatsApp/SendGupshupWhatsAppMessageAsync`;
    const body = {
      type3: WhatsappData.Type,
      url2: Attachurl,
      filename: filename,
      message: WhatsappData.message,
      destination: WhatsappData.destination,
      source: WhatsappData.source,
      app: WhatsappData.app,
      key: WhatsappData.apikey,
      flow: 'Outbound',
      id: null
    };
    return this.http.post(url, body).pipe(map(x => x));
  }

  uploadDocument = (user, departmentName: string, uploadfiles: FileAttachment[], uploadModel, WhatsappData) => {
    let data = {
      fileContentModel: {
        key: null,
        siteId: null,
        userType: departmentName ? departmentName : null,
        template: null,
        uploadedBy: user.Firstname + ' ' + user.LastName,
        remark: null,
        //  contentType: uploadModel.ContentType ? uploadModel.ContentType : null,
        fileType: uploadModel.FileType ? uploadModel.FileType : null,
        subprojectId: null,
        id: user.UserId
      },
      whatsappData: {
        type3: WhatsappData.Type,
        url2: null,
        filename: WhatsappData.filename,
        message: WhatsappData.message,
        destination: WhatsappData.destination,
        source: WhatsappData.source,
        app: WhatsappData.app,
        key: WhatsappData.apikey,
        flow: 'Outbound',
        id: null
      },
      file: uploadfiles
    }
    const url = `${environment.empApiUrl}api/WhatsApp/UploadFileForSendWhatsapp`;
    return this.http.post(url, data).pipe(map(x => x));
  }

  sendMessage = (user, mobileNo, Body) => {
    let data = {
      mobileNo: mobileNo ? mobileNo : null,
      smsBody: Body ? Body : null,
      userId: user.UserId ? user.UserId : null,
      entityId: user.EntityId ? user.EntityId : null,
      userType: user.UserType ? user.UserType : null,
    }
    let url = `${environment.empApiUrl}api/WhatsApp/SendSMSLinkToCustomer?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType${user.UserType}`;
    return this.http.post(url, data).pipe(map(x => x), take(1));
  }
}
