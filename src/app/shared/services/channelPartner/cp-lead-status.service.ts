import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CpLeadStatusService {

  constructor(private http: HttpClient) { }

  GetReferralStatusDetails = (user) => {
    const url = `${environment.apiUrl}api/ReferralStatus/GetReferralStatusById/UserId,EntityId,UserType?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}`;
    return this.http.get(url).pipe(map(x => x));
  }

  GetChannelPartnerReporting = (user) => {
    const url = `${environment.channelApiUrl}api/ChannelPartners/GetChannelPartnerByReportingTo/UserId,EntityId,UserType?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}`;
    return this.http.get(url).pipe(map(x => x));
  }

  cpStatusUpdate = (user, cpLeadDetails) => {
    let data = {
      Id: user.UserId,
      entityId: user.EntityId,
      referralId: cpLeadDetails.ReferralId,
      referralStatus: cpLeadDetails.ReferralStatus,
      remarks: cpLeadDetails.remarks,
      creatorUserType: user.UserType,
      brokerId: cpLeadDetails.BrokerAssingedId,
    }
    const url = `${environment.channelApiUrl}api/ChannelPartners/ChannelPartnerReferralStatusUpdate/UserId,EntityId,UserType?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}`;
    return this.http.put(url, data).pipe(map(x => x), take(1));
  }

  getInteractionDetails = (user, leadDetail) => {
    const url = `${environment.empApiUrl}api/Interaction/GetEntity/UserId,EntityId,UserType?UserId=${user.UserId}&EntityId=${leadDetail.ReferralId}&UserType=${leadDetail.UserType}`;
    return this.http.get(url).pipe(map(x => x));
  }

  importExcel = (user, importLeadExcel) => {
    let data = {
      referralExcelModel: {
        entityId: user.EntityId,
        userType: user.UserType,
        id: user.UserId
      },
      files: importLeadExcel
    } 
    const url = `${environment.apiUrl}api/Referral/ImportExcelData/UserId,EntityId,UserType?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}`;
    return this.http.post(url, data).pipe(map(x => x),take(1));
  }

}
