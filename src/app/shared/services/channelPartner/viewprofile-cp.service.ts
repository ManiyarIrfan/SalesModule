import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ViewprofileCpService {

  constructor(private http: HttpClient) { }

  GetChannelPartnerDetails = (user) => {
    const url = `${environment.channelApiUrl}api/ChannelPartners/GetById/UserId,EntityId,UserType?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}&TenantId=${user.TenantId}`;
    return this.http.get(url).pipe(map(x => x));
  }

  GetMyLeadsDetails = (user) => {
    const url = `${environment.channelApiUrl}api/ChannelPartners/GetMyLeadsById/UserId,EntityId,UserType?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}`;
    return this.http.get(url).pipe(map(x => x));
  }

  GetMyBookingsDetails = (user) => {
    const url = `${environment.channelApiUrl}api/ChannelPartners/GetMyOrdersById/UserId,EntityId,UserType?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}`;
    return this.http.get(url).pipe(map(x => x));
  }
  GetMyIncentiveDetails = (user) => {
    const url = `${environment.channelApiUrl}api/ChannelPartners/GetMyIncentiveById/UserId,EntityId,UserType?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}`;
    return this.http.get(url).pipe(map(x => x));
  }

  UpdateChannelPartnerDetails = (channelPartnerModel, user, uploadImages) => {
    let data = {
      channelPartnerModel: {
        Id: user.UserId,
        UserType: user.UserType,
        entityId: user.EntityId,
        brokerid: channelPartnerModel.BrokerId ? channelPartnerModel.BrokerId : null,
        addressline1: channelPartnerModel.AddressLine1 ? channelPartnerModel.AddressLine1 : null,
        addressline2: channelPartnerModel.AddressLine2 ? channelPartnerModel.AddressLine2 : null,
        landmark: channelPartnerModel.Landmark ? channelPartnerModel.Landmark : null,
        city: channelPartnerModel.City ? channelPartnerModel.City : null,
        state: channelPartnerModel.State ? channelPartnerModel.State : null,
        country: channelPartnerModel.Country ? channelPartnerModel.Country : null,
        pincode: channelPartnerModel.Pincode ? channelPartnerModel.Pincode : null,
        alternatenumber: channelPartnerModel.AlternateNumber ? channelPartnerModel.AlternateNumber : null,
        rerano: channelPartnerModel.ReraNo ? channelPartnerModel.ReraNo : null,
        organization: channelPartnerModel.Organization ? channelPartnerModel.Organization : null,
        type: channelPartnerModel.Type ? channelPartnerModel.Type : null,
        bankName: channelPartnerModel.BankName ? channelPartnerModel.BankName : null,
        ifsc: channelPartnerModel.IFSC ? channelPartnerModel.IFSC : null,
        accountNo: channelPartnerModel.AccountNo ? channelPartnerModel.AccountNo : null,
        branch: channelPartnerModel.Branch ? channelPartnerModel.Branch : null,
        upiCode: channelPartnerModel.UPICode ? channelPartnerModel.UPICode : null,
        dob: channelPartnerModel.DateOfBirth ? channelPartnerModel.DateOfBirth : null,
        reraStartDate: channelPartnerModel.ReraStartDate ? channelPartnerModel.ReraStartDate : null,
        reraEndDate: channelPartnerModel.ReraEndDate ? channelPartnerModel.ReraEndDate : null,
        tan: channelPartnerModel.TAN ? channelPartnerModel.TAN : null,
        panType: channelPartnerModel.PANType ? channelPartnerModel.PANType : null,
        panNo: channelPartnerModel.PanNo ? channelPartnerModel.PanNo : null,
        gstin: channelPartnerModel.GSTIN ? channelPartnerModel.GSTIN : null,
        agreement: channelPartnerModel.Agreement ? channelPartnerModel.Agreement : null,
      },
      file: uploadImages,
      deleteFileUrl: channelPartnerModel.deleteImages,
      dbImageUrlList: channelPartnerModel.ImageUrlList
    }
    let url = `${environment.channelApiUrl}api/ChannelPartners/UpdateChannelPartnerProfile/UserId,EntityId,UserType?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}`;
    return this.http.put(url, data).pipe(map(x => x), take(1));
  }
  getPanValidation = (panNo) => {
    const url = `${environment.apiUrl}api/IsDuplicate/emailId?Input=${'PANVarification'}&PanNumber=${panNo}`;
    return this.http.get(url).pipe(map(x => x));
  }

}
