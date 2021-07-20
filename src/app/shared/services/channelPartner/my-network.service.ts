import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MyNetworkService {

  constructor(private http: HttpClient) { }

  mobileDuplication = (user, mobileNo) => {
    const url = `${environment.channelApiUrl}api/ChannelPartners/CpAvailableOrNot/UserId,EntityId,UserType?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}&MobileNo=${mobileNo}`;
    return this.http.get(url).pipe(map(x => x));
  }
  emailDuplication = (user, Email) => {
    const url = `${environment.channelApiUrl}api/ChannelPartners/CpAvailableOrNot/UserId,EntityId,UserType?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}&Email=${Email}`;
    return this.http.get(url).pipe(map(x => x));
  }
  referChannelpartner = (user, chanalPartnerModel) => {
    let data = {
      Id: user.UserId,
      UserType: user.UserType,
      entityId: user.EntityId,
      name: chanalPartnerModel.Name,
      mobileNo: chanalPartnerModel.MobileNo,
      email: chanalPartnerModel.Email,
    }
    let url = `${environment.channelApiUrl}api/ChannelPartners/ReferChannelPartner/UserId,EntityId,UserType,DeviceDetails?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}&DeviceDetails=${user.DeviceDetails}`;
    return this.http.put(url, data).pipe(map(x => x), take(1));
  }
  myChannelPartnerReferral = (user) => {
    const url = `${environment.channelApiUrl}api/ChannelPartners/MyChannelPartnerReferral/UserId,EntityId,UserType?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}`;
    return this.http.get(url).pipe(map(x => x));
  }
}
