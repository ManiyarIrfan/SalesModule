import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ScheduledSiteVisitService {

  constructor(private http: HttpClient) { }

  getEnquiryandReferralDetails = (user) => {
    const url = `${environment.empApiUrl}api/LeadDashboard/GetALLLeadForFrontDeskOrAdminById/UserId,EntityId,UserType?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}`
    return this.http.get(url).pipe(map(x => x));
  }

  UpdateLeadDetails = (leadinfoDetails, user, salesId) => {
    let data = {
      Id: user.UserId,
      UserType: user.UserType,
      EntityId: user.EntityId,
      referralId: leadinfoDetails.ReferralId,
      referralstatus: leadinfoDetails.ReferralStatus,
      face2Face: leadinfoDetails.Face2Face,
      noOfsitevisit: leadinfoDetails.NoOfSiteVisit,
      creatorUserType: user.UserType,
      projectvisited: leadinfoDetails.ProjectVisited,
      salesagentassinged: salesId.SalesAgentAssignedId,
      statusChangeReason: leadinfoDetails.StatusChangeReason,
      remarks: leadinfoDetails.remarks,
      preferredTime: leadinfoDetails.PreferredTime,
      preferredDate: leadinfoDetails.PreferredDate
    }
    let url = `${environment.empApiUrl}api/LeadDashboard/Update/UserId,EntityId,UserType?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}&TenantId=${user.TenantId}`;
    return this.http.put(url, data).pipe(map(x => x, take(1)));
  }

  getAllSalesEmployeeOnSelected = (user,Role) => {
    const url = `${environment.empApiUrl}api/GetAllEmployeeNames_ByRole?Role=${Role}&TenantId=${user.TenantId}`;
    return this.http.get(url).pipe(map(x => x));
  }

  search(user, term) {
    const url = `${environment.empApiUrl}api/PresalesDashboard/SearchEnquiryForFrontDeskOrAdmin/UserId,EntityId,UserType,Search?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}&TenantId=${user.TenantId}&Search=` + term;
    return this.http.get(url).pipe(map(x => x));
  }

  interaction = (user, interactionDetails) => {
    let data = {
      id: user.UserId,
      userType: interactionDetails.UserType,
      entityId: interactionDetails.EntityId,
      details: interactionDetails.Details,
      creatorId: user.EntityId,
      creatorUserType: user.UserType,
      interactionType: interactionDetails.interactionType,
      followUpRequired: interactionDetails.followUpRequired ? interactionDetails.followUpRequired : null,
      followUpDate: interactionDetails.followUpDate ? interactionDetails.followUpDate : null,
      followUpTime: interactionDetails.followUpTime ? interactionDetails.followUpTime : null,
      followUpStatus: interactionDetails.followUpStatus ? interactionDetails.followUpStatus : null,
      followUpType: interactionDetails.followUpType ? interactionDetails.followUpType : null,
    }
    let url = `${environment.empApiUrl}api/Interaction/Insert/UserId,EntityId,UserType?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}&TenantId=${user.TenantId}`;
    return this.http.post(url, data).pipe(map(x => x, take(1)));
  }

  siteVisitInsert = (user, referralDetails) => {
    let data = {
      id: user.UserId,
      referralId: referralDetails.ReferralId ? referralDetails.ReferralId : null,
      projectId: referralDetails.PreferredProjectId ? referralDetails.PreferredProjectId : null
    }
    let url = `${environment.empApiUrl}api/TRUPay/InsertSVRecord?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}`;
    return this.http.post(url, data).pipe(map(x => x, take(1)));
  }

  GetProjectNameList = (user) => {
    const url = `${environment.apiUrl}api/ProjectDetails/GetAll/ProjectNames/UserId,EntityId,UserType?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}&TenantId=${user.TenantId}`;
    return this.http.get(url).pipe(map(x => x));
  }

}
