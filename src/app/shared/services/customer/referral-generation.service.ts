import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ReferralGenerationService {

  constructor(private http: HttpClient) { }

  GetPreferredLocationOnCity = (user, PreferredCityName) => {
    const url = `${environment.apiUrl}api/ProjectDetails/GetLocationByCity/UserId,EntityId,UserType,City?TenantId=${user.TenantId}&City=${PreferredCityName}`;
    return this.http.get(url).pipe(map(x => x));
  }
  GetProjectListOnSelectedLocation = (user, PreferredAreaName) => {
    const url = `${environment.apiUrl}api/ProjectDetails/GetProjectNames/UserId,EntityId,UserType,location?TenantId=${user.TenantId}&location=${PreferredAreaName}`;
    return this.http.get(url).pipe(map(x => x));
  }
  InsertReferralGenerationDetails = (refModel, user) => {
    let data = {
      UserType: user.UserType,
      Id: user.UserId,
      EntityId: user.EntityId,
      Title: refModel.refTitle ? refModel.refTitle:'',
      FirstName: refModel.refFirst,
      LastName: refModel.refLast ? refModel.refLast : '',
      AddressLine1: refModel.refAddress1 ? refModel.refAddress1 : '',
      City: refModel.refCity,
      MobileNo: refModel.refMobileNo,
      AlternateNo: refModel.refLandline ? refModel.refLandline : '',
      Email: refModel.refEmail,
      Occupation: refModel.refOccupation ? refModel.refOccupation : '',
      Relationship: refModel.refRelationship ? refModel.refRelationship : '',
      RequirementType: refModel.requireType,
      Budget: refModel.budget,
      Bhk: refModel.bhk,
      CommercialOption: refModel.comm_options,
      ITOption: refModel.it_options,
      PreferredCity: refModel.preCity,
      VisitSite: refModel.visitSite ? refModel.visitSite : '',
      PreferredDate: refModel.preDate ? refModel.preDate : '',
      PreferredTime: refModel.preTime ? refModel.preTime : '',
      source: refModel.Source ? refModel.Source :'',
      noOfSiteVisit: refModel.noOfsiteVisit ? refModel.noOfsiteVisit :'',
      face2Face: refModel.face2Face ? refModel.face2Face :'',
      preferredarea: refModel.PreferredArea,
      preferredproject: refModel.PreferredProject,
      Possession: refModel.Possession ? refModel.Possession : '',
    }
    let url = `${environment.apiUrl}api/Referral/Insert/UserId,UserType?UserId=${user.UserId}&UserType=${user.UserType}&DeviceDetails=${user.DeviceDetails}`;
    return this.http.post(url, data).pipe(map(x => x), take(1));
  }
  getMobileValidation = (mobile) => {
    const url = `${environment.apiUrl}/api/IsDuplicate/mobileNo?MobileNo=${mobile}`;
    return this.http.get(url).pipe(map(x => x));
  }
  getEmailValidation = (email) => {
    const url = `${environment.apiUrl}/api/IsDuplicate/emailId?EmailId=${email}`;
    return this.http.get(url).pipe(map(x => x));
  }

}
