import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CpDetailsService {

  constructor(private http: HttpClient) { }

  GetChannelPartnerDetails = (channelPartner) => {
    const url =  `${environment.channelApiUrl}api/ChannelPartners/GetById/UserId,EntityId,UserType?UserId=${channelPartner.Id}&EntityId=${channelPartner.EntityId}&UserType=${channelPartner.UserType}&TenantId=${channelPartner.TenantId}`;
    return this.http.get(url).pipe(map(x => x));
  }
  onCall = (user, to, from) => {
    let data = {
      Id: user.UserId,
      UserType: user.UserType,
      entityId: user.EntityId,
      to: to,
      from: from,
    }  
    let url =  `${environment.empApiUrl}api/Employees/CallCustomer/UserId,UserType,EntityId?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}&TenantId=${user.TenantId}`;
    return this.http.post(url, data).pipe(map(x => x),take(1));
  }
  sendMessage = (user, cpModel, messageModel) => {
    let data = {
      Id: user.UserId,
      userType: cpModel.UserType,
      entityId: user.EntityId,
      to: cpModel.MobileNo,
      body: messageModel.Template,
      to_Id: cpModel.EntityId  
    }  
    let url =  `${environment.empApiUrl}api/Employees/SMSToKnowlarityCustomer/UserId,UserType,EntityId?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}&TenantId=${user.TenantId}`;
    return this.http.post(url, data).pipe(map(x => x),take(1));
  }
  insertInteractionStatus = (user, followUpDetails, cpDetails) => {
    let data = {
      Id: user.UserId,
      UserType: cpDetails.UserType,
      creatorId: user.EntityId,
      creatorUserType: user.UserType,
      entityId: cpDetails.EntityId,
      details: followUpDetails.Details,
      followUpRequired: "Yes",
      followUpDate: followUpDetails.FollowUpDate,
      followUpTime: followUpDetails.FollowUpTime,
      followUpStatus: followUpDetails.FollowUpStatus,
      followUpType: followUpDetails.followUpType
    }   
    let url =   `${environment.empApiUrl}api/Interaction/Insert/UserId,EntityId,UserType?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}&TenantId=${user.TenantId}`;
    return this.http.post(url, data).pipe(map(x => x),take(1));
  }
  getInteractionDetails = (cpDetail) => {
    const url = `${environment.empApiUrl}api/Interaction/GetEntity/UserId,EntityId,UserType?UserId=${cpDetail.Id}&EntityId=${cpDetail.EntityId}&UserType=${cpDetail.UserType}`;
    return this.http.get(url).pipe(map(x => x));
  }
  getCallDetails = (user, cpDetail) => {
    const url = `${environment.empApiUrl}api/PresalesDashboard/GetCallDetails/UserId,EntityId,UserType,CallerEntityId,CallerUserType?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}&CallerEntityId=${cpDetail.EntityId}&CallerUserType=${cpDetail.UserType}`;
    return this.http.get(url).pipe(map(x => x));
  }
  getSmsDetails = (user, cpDetail) => {
    const url =  `${environment.empApiUrl}api/PresalesDashboard/GetSMSDetails/UserId,EntityId,UserType?UserId=${user.UserId}&EntityId=${cpDetail.EntityId}&UserType=${cpDetail.UserType}`;
    return this.http.get(url).pipe(map(x => x));
  }
  
}
