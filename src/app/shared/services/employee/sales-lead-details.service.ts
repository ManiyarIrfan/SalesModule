import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SalesLeadDetailsService {

  constructor(private http: HttpClient) { }

  GetSelectedProject = (user) => {
    const url = `${environment.apiUrl}api/ProjectDetails/GetAll/ProjectNames/UserId,EntityId,UserType?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}&TenantId=${user.TenantId}`;
    return this.http.get(url).pipe(map(x => x));
  }
  getAllSalesEmployeeOnSelected = (user, Role) => {
    const url = `${environment.empApiUrl}api/GetAllEmployeeNames_ByRole?Role=${Role}&TenantId=${user.TenantId}`;
    return this.http.get(url).pipe(map(x => x));
  }
  getInfoByreferralId = (user, referralId) => {
    const url = `${environment.empApiUrl}api/LeadDashboard/GetLeadById/UserId,EntityId,UserType,ReferralId?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}&ReferralId=${referralId}`;
    return this.http.get(url).pipe(map(x => x));
  }
  InsertCallObservationData = (user, enquiryId, List) => {
    let data = {
      entityId: enquiryId,
      userType: 'Referral',
      employeeId: user.EntityId,
      id: user.UserId,
      callObservationTransactionTemp: List
    }
    let url = `${environment.empApiUrl}api/PresalesDashboard/CallObservationTransaction/UserId,EntityId,UserType?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}`;
    return this.http.post(url, data).pipe(map(x => x, take(1)));
  }
  callObservation = (user, EnquiryDetails) => {
    const url = `${environment.empApiUrl}api/PresalesDashboard/CallObservation/UserId,EntityId,UserType?UserId=${user.UserId}&EntityId=${EnquiryDetails.ReferralId}&UserType=${EnquiryDetails.UserType}&TenantId=${user.TenantId}`;
    return this.http.get(url).pipe(map(x => x));
  }
  onCall = (user, to, from, leadDetails) => {
    let data = {
      Id: user.UserId,
      UserType: user.UserType,
      entityId: user.EntityId,
      to: to,
      from: from,
      callerEntityId: leadDetails.ReferralId,
      callerUserType: leadDetails.UserType
    }
    let url = `${environment.empApiUrl}api/Employees/CallCustomer/UserId,UserType,EntityId?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}&TenantId=${user.TenantId}`;
    return this.http.post(url, data).pipe(map(x => x, take(1)));
  }
  sendMessage = (user, leadModel, messageModel) => {
    let data = {
      Id: user.UserId,
      userType: leadModel.UserType,
      entityId: user.EntityId,
      to: leadModel.MobileNo,
      body: messageModel.Template,
      to_Id: leadModel.ReferralId
    }
    let url = `${environment.empApiUrl}api/Employees/SMSToKnowlarityCustomer/UserId,UserType,EntityId?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}&TenantId=${user.TenantId}`;
    return this.http.post(url, data).pipe(map(x => x, take(1)));
  }

  UpdateLeadDetails = (leadinfoDetails, user) => {
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
      salesagentassinged: leadinfoDetails.SalesAgentAssignedId,
      statusChangeReason: leadinfoDetails.StatusChangeReason,
      remarks: leadinfoDetails.remarks,
      preferredTime: leadinfoDetails.PreferredTime,
      preferredDate: leadinfoDetails.PreferredDate,
      presalesAgentAssigned: leadinfoDetails.PresalesAgentAssigned,
      alternateEmail: leadinfoDetails.AlternateEmail,
      leadFirstName: leadinfoDetails.FirstName,
      leadLastName: leadinfoDetails.LastName,
      alternateNo: leadinfoDetails.AlternateNo,
      interactionType: leadinfoDetails.InteractionType,
      dob: leadinfoDetails.Dob
    }
    let url = `${environment.empApiUrl}api/LeadDashboard/Update/UserId,EntityId,UserType?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}`;
    return this.http.put(url, data).pipe(map(x => x, take(1)));
  }

  createSiteVisit = (user, leadinfoDetails, siteVisitModel) => {
    let data = {
      Id: user.UserId,
      UserType: user.UserType,
      entityId: user.EntityId,
      referralId: leadinfoDetails.ReferralId,
      referralStatus: leadinfoDetails.ReferralStatus,
      noOfSiteVisit: leadinfoDetails.NoOfSiteVisit,
      face2Face: leadinfoDetails.Face2Face,
      projectVisited: siteVisitModel.PreferredProject,
      visitSite: 'Yes',
      preferredTime: siteVisitModel.time,
      preferredDate: siteVisitModel.preDate,
      remarks: siteVisitModel.Details,
      creatorUserType: user.UserType,
      salesAgentAssinged: leadinfoDetails.SalesAgentAssignedId
    }
    let url = `${environment.empApiUrl}api/LeadDashboard/Update/UserId,EntityId,UserType?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}&TenantId=${user.TenantId}`;
    return this.http.put(url, data).pipe(map(x => x, take(1)));
  }

  updateFollowUpStatus = (user, leadinfoDetails, leadId) => {
    let data = {
      Id: user.UserId,
      UserType: user.UserType,
      entityId: user.EntityId,
      referralId: leadId,
      followUp: leadinfoDetails.FollowUp,
      followUpDate: leadinfoDetails.FollowUpDate,
      followUpTime: leadinfoDetails.FollowUPTime,
      followUpDetails: leadinfoDetails.Agenda,
      followUpStatus: leadinfoDetails.FollowUpStatus,
      followUpType: leadinfoDetails.FollowUpType
    }
    let url = `${environment.empApiUrl}api/LeadDashboard/ScheduleFollowUp/UserId,EntityId,UserType?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}`;
    return this.http.put(url, data).pipe(map(x => x, take(1)));
  }
  insertInteractionStatus = (user, interactionModel, leadinfoDetails) => {
    let data = {
      Id: user.UserId,
      UserType: leadinfoDetails.UserType,
      entityId: leadinfoDetails.ReferralId,
      creatorId: user.EntityId,
      creatorUserType: user.UserType,
      details: interactionModel.Details,
      followUpRequired: interactionModel.followUp
    }
    let url = `${environment.empApiUrl}api/Interaction/Insert/UserId,EntityId,UserType?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}&TenantId=${user.TenantId}`;
    return this.http.post(url, data).pipe(map(x => x, take(1)));
  }
  getAllSmsNames = (user, selectedProject, Brochure, ContentType) => {
    let idBr = Brochure === 'false' ? true : false
    const url = `${environment.empApiUrl}api/Employees/GetBroucherByProjectName/UserId,UserType,EntityId,ProjectName,IsBrochure,ContentType?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}&ProjectName=${selectedProject}&IsBrochure=${idBr}&ContentType=${ContentType}`;
    return this.http.get(url).pipe(map(x => x));
  }
  getSmsTemplate = (messageTemplate) => {
    const url = `${environment.empApiUrl}api/GetContentByFileName/FileName,ContentType?&FileName=${messageTemplate}`;
    return this.http.get(url).pipe(map(x => x));
  }
  getInteractionDetails = (user, leadDetail) => {
    const url = `${environment.empApiUrl}api/Interaction/GetEntity/UserId,EntityId,UserType?UserId=${user.UserId}&EntityId=${leadDetail.ReferralId}&UserType=${leadDetail.UserType}`;
    return this.http.get(url).pipe(map(x => x));
  }
  getCallDetails = (user, leadDetail) => {
    const url = `${environment.empApiUrl}api/PresalesDashboard/GetCallDetails/UserId,EntityId,UserType,CallerEntityId,CallerUserType?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}&CallerEntityId=${leadDetail.ReferralId}&CallerUserType=${leadDetail.UserType}`;
    return this.http.get(url).pipe(map(x => x));
  }
  getSmsDetails = (user, leadDetail) => {
    const url = `${environment.empApiUrl}api/PresalesDashboard/GetSMSDetails/UserId,EntityId,UserType?UserId=${user.UserId}&EntityId=${leadDetail.ReferralId}&UserType=${leadDetail.UserType}`;
    return this.http.get(url).pipe(map(x => x));
  }
  search(user, term) {
    const url = `${environment.empApiUrl}api/PresalesDashboard/SearchEnquiryForFrontDeskOrAdmin/UserId,EntityId,UserType,Search?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}&TenantId=${user.TenantId}&Search=` + term;
    return this.http.get(url).pipe(map(x => x));
  }
  getCustomerDetail = (user, EntityId, UserType, Input) => {
    const url = `${environment.executionApiUrl}api/ExternalTaskExecution/CustomerPreferenceSelect/UserId,EntityId,UserType?UserId=${user.UserId}&EntityId=${EntityId}&UserType=${UserType}&Input=${Input}`;
    return this.http.get(url).pipe(map(x => x));
  }
  mergeLeadToBeDeleted = (user, EnquiryDetails) => {
    let data = {
      ReferralId: EnquiryDetails.ReferralId,
      ReferralMergeId: EnquiryDetails.ReferralMergeId,
      id: user.UserId
    }
    const url = `${environment.empApiUrl}api/LeadDashboard/MergeLead/UserId,EntityId,UserType?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}`;
    return this.http.put(url, data).pipe(map(x => x), take(1));
  }
}
