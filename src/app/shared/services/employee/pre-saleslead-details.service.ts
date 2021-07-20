import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PreSalesleadDetailsService {

  constructor(private http: HttpClient) { }
  getSourceCampaign = (user, Type) => {
    const url = `${environment.empApiUrl}api/EmployeeAdmin/GetSourceCampaign/UserId,EntityId,UserType,Type?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}&Type=${Type ? Type : ''}&TenantId=${user.TenantId}`;
    return this.http.get(url).pipe(map(x => x));
  }
  getByEnquiryLead = (user, leadDetail) => {
    const url = `${environment.empApiUrl}api/PresalesDashboard/GetEnquiryById/UserId,EntityId,UserType,EnquiryId?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}&EnquiryId=${leadDetail}`;
    return this.http.get(url).pipe(map(x => x));
  }
  getAllProjectNames = (user) => {
    const url = `${environment.apiUrl}api/ProjectDetails/GetAll/ProjectNames/UserId,EntityId,UserType?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}&TenantId=${user.TenantId}`;
    return this.http.get(url).pipe(map(x => x));
  }
  GetAllEmployeesNamesOnSelected = (user, Role) => {
    const url = `${environment.empApiUrl}api/GetAllEmployeeNames_ByRole?Role=${Role}&TenantId=${user.TenantId}`;
    return this.http.get(url).pipe(map(x => x));
  }
  search = (user, term) => {
    const url = `${environment.empApiUrl}api/PresalesDashboard/SearchEnquiry/UserId,EntityId,UserType,Search?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}&TenantId=${user.TenantId}&Search=` + term;
    var ClientList = this.http.get(url).pipe(map((responce) => {
      // return (r[0].length != 0 ? r[0].data[0] : [{ "CustId": 0, "CustName": "No Record Found" }]) as any[]
      return (responce ? responce['data'][0] : [{ "CustId": 0, "CustName": "No Record Found" }]) as any[]
    }));
    return ClientList;
  }
  callObservationTransaction = (user, enquiryId, List) => {
    let data = {
      entityId: enquiryId,
      userType: 'Enquiry',
      employeeId: user.EntityId,
      id: user.UserId,
      callObservationTransactionTemp: List
    }
    let url = `${environment.empApiUrl}api/PresalesDashboard/CallObservationTransaction/UserId,EntityId,UserType?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}`;
    return this.http.post(url, data).pipe(map(x => x, take(1)));
  }
  emailValidation = (user, email) => {
    const url = `${environment.empApiUrl}api/IsAllReadyExists/UserId,EntityId,UserType?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}&Search=${email}`;
    return this.http.get(url).pipe(map(x => x));
  }

  updateStatus = (user, leadinfoDetails, updateRemark) => {
    let data = {
      Id: user.UserId,
      UserType: user.UserType,
      entityId: user.EntityId,
      enquiryId: leadinfoDetails.EnquiryId,
      firstName: leadinfoDetails.FirstName,
      lastName: leadinfoDetails.LastName,
      alternateNo: leadinfoDetails.AlternateNo,
      requirementType: leadinfoDetails.RequirementType,
      budget: leadinfoDetails.Budget,
      bhk: leadinfoDetails.Bhk,
      preferredArea: leadinfoDetails.PreferredLocation,
      preferredProject: leadinfoDetails.PreferredProject,
      fundingSource: leadinfoDetails.FundingSource,
      preferredCity: leadinfoDetails.PreferredCity,
      source: leadinfoDetails.Source,
      typeOfLead: leadinfoDetails.TypeOfLead,
      msgDetails: leadinfoDetails.MsgDetails,
      contactedBy: leadinfoDetails.ContactedBy,
      propertyType: leadinfoDetails.PropertyType,
      callStatus: leadinfoDetails.CallStatus,
      enquiryStatus: leadinfoDetails.EnquiryStatus,
      createdOn: leadinfoDetails.CreatedOn,
      statusChangeReason: leadinfoDetails.StatusChangeReason,
      possession: leadinfoDetails.Possession,
      primaryPurpose: leadinfoDetails.PrimaryPurpose,
      remark: updateRemark,
      presalesAgentAssigned: leadinfoDetails.PresalesAgentAssigned,
      Email: leadinfoDetails.Email,
      alternateEmail: leadinfoDetails.AlternateEmail,
      occupation: leadinfoDetails.Occupation,
      interactionType: 'Note',
      CountryCode: leadinfoDetails.CountryCode,
      IsInterNational: leadinfoDetails.IsNRI,
      Country: leadinfoDetails.Country
    }
    let url = `${environment.empApiUrl}api/PresalesDashboard/UpdateEnquiry/UserId,EntityId,UserType?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}`;
    return this.http.put(url, data).pipe(map(x => x), take(1));
  }
  updateFollowUpStatus = (user, leadinfoDetails, EnquiryId) => {
    let data = {
      Id: user.UserId,
      UserType: user.UserType,
      entityId: user.EntityId,
      enquiryId: EnquiryId,
      followUp: leadinfoDetails.FollowUp,
      followUpDate: leadinfoDetails.FollowUpDate,
      followUpTime: leadinfoDetails.FollowUpTime,
      followUpDetails: leadinfoDetails.Agenda,
      followUpStatus: leadinfoDetails.FollowUpStatus,
      followUpType: leadinfoDetails.followUpType
    }
    let url = `${environment.empApiUrl}api/PresalesDashboard/UpdateEnquiryFollowUp/UserId,EntityId,UserType?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}`;
    return this.http.put(url, data).pipe(map(x => x), take(1));
  }
  insertInteractionStatus = (user, interactionDetails, EnquiryDetails) => {
    let data = {
      Id: user.UserId,
      UserType: EnquiryDetails.UserType,
      creatorId: user.EntityId,
      creatorUserType: user.UserType,
      entityId: EnquiryDetails.EnquiryId,
      details: interactionDetails.Details,
      followUpRequired: interactionDetails.followUp,
      interactionType: interactionDetails.interactionType,
      followUpDate: interactionDetails.FollowUpDate,
      followUpTime: interactionDetails.FollowUpTime,
      followUpStatus: interactionDetails.followUpStatus
    }
    let url = `${environment.empApiUrl}api/Interaction/Insert/UserId,EntityId,UserType?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}&TenantId=${user.TenantId}`;
    return this.http.post(url, data).pipe(map(x => x), take(1));
  }
  sendEmail = (user, toEmail, emailmodel) => {
    let data = {
      to: toEmail,
      cc: user.UserEmail,
      subject: emailmodel.Subject,
      body: emailmodel.Details,
      fileName: emailmodel.Attachment
    }
    let url = `${environment.empApiUrl}api/Employees/SendAttachment/UserId,UserType,EntityId?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}`;
    return this.http.post(url, data).pipe(map(x => x), take(1));
  }
  userOnMobile = (user, mobileNo) => {
    const url = `${environment.empApiUrl}api/IsAllReadyExists/UserId,EntityId,UserType?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}&Search=${mobileNo}`;
    return this.http.get(url).pipe(map(x => x));
  }

  GetTemplateContent = (selectedKey) => {
    const url = `${environment.empApiUrl}api/GetContentByFileName/FileName,ContentType?FileName=${selectedKey}`;
    return this.http.get(url).pipe(map(x => x));
  }
  GetProjectNameList = (user, Brochure) => {
    const url = `${environment.empApiUrl}api/Employees/GetBroucherProjectNameAll/UserId,UserType,EntityId,IsBrochure?UserId=${user.UserId}&EntityId=${user.EntityId}&TenantId=${user.TenantId}&IsBrochure=${Brochure}`;
    return this.http.get(url).pipe(map(x => x));
  }
  GetBrochureNameList = (user, selectedProject, Brochure) => {
    let idBr = Brochure === 'true' ? true : false
    const url = `${environment.empApiUrl}api/Employees/GetBroucherByProjectName/UserId,UserType,EntityId,ProjectName,IsBrochure,ContentType?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}&ProjectName=${selectedProject}&IsBrochure=${idBr}`;
    return this.http.get(url).pipe(map(x => x));
  }
  GetProjectListOnSelected = (user) => {
    const url = `${environment.empApiUrl}api/ProjectDetails/GetAll/ProjectNames/UserId,EntityId,UserType?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}&TenantId=${user.TenantId}`;
    return this.http.get(url).pipe(map(x => x));
  }
  InsertPdfFile = (projectName, uploadPdfFileList, user) => {
    let data = {
      employeeAdminFileUploadParameter: {
        Id: user.UserId,
        TenantId: user.TenantId,
        UserType: user.UserType,
        entityId: user.EntityId,
        projectname: projectName
      },
      file: uploadPdfFileList
    }
    let url = `${environment.empApiUrl}api/EmployeeAdmin/EmployeeProjectsPdfUpload/UserId,EntityId,UserType?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}`;
    return this.http.post(url, data).pipe(map(x => x), take(1));
  }
  onCall = (user, to, from, enquiryDetails) => {
    let data = {
      Id: user.UserId,
      UserType: user.UserType,
      entityId: user.EntityId,
      to: to,
      from: from,
      callerEntityId: enquiryDetails.EnquiryId,
      callerUserType: enquiryDetails.UserType
    }
    let url = `${environment.empApiUrl}api/Employees/CallCustomer/UserId,UserType,EntityId?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}&TenantId=${user.TenantId}`;
    return this.http.post(url, data).pipe(map(x => x), take(1));
  }
  sendMessage = (user, enquiryModel, messageModel, usertype) => {
    let data = {
      Id: user.UserId,
      userType: usertype,
      entityId: user.EntityId,
      to: enquiryModel.MobileNo,
      body: messageModel.Template,
      to_Id: enquiryModel.EnquiryId
    }
    let url = `${environment.empApiUrl}api/Employees/SMSToKnowlarityCustomer/UserId,UserType,EntityId?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}&TenantId=${user.TenantId}`;
    return this.http.post(url, data).pipe(map(x => x), take(1));
  }
  insertSiteVisit = (user, enquiryModel, siteVisitModel) => {
    let data = {
      Id: user.UserId,
      UserType: user.UserType,
      entityId: user.EntityId,
      enquiryId: enquiryModel.EnquiryId,
      preferredProject: siteVisitModel.PreferredProject,
      preferredTime: siteVisitModel.time,
      preferredDate: siteVisitModel.preDate,
      interactionComments: siteVisitModel.Details,
      interactionId: siteVisitModel.interactionId,
      input: siteVisitModel.Action,
      IsSVConfirm: siteVisitModel.IsSVConfirm
    }
    let url = `${environment.empApiUrl}api/PresalesDashboard/ScheduleSiteVisit/UserId,EntityId,UserType?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}&TenantId=${user.TenantId}&DeviceDetails=${user.DeviceDetails}`;
    return this.http.put(url, data).pipe(map(x => x), take(1));
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
    const url = `${environment.empApiUrl}api/Interaction/GetEntity/UserId,EntityId,UserType?UserId=${user.UserId}&EntityId=${leadDetail.EnquiryId}&UserType=${leadDetail.UserType}`;
    return this.http.get(url).pipe(map(x => x));
  }
  getCallDetails = (user, enquiryDetails) => {
    const url = `${environment.empApiUrl}api/PresalesDashboard/GetCallDetails/UserId,EntityId,UserType,CallerEntityId,CallerUserType?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}&CallerEntityId=${enquiryDetails.EnquiryId}&CallerUserType=${enquiryDetails.UserType}`;
    return this.http.get(url).pipe(map(x => x));
  }
  
  getSmsDetails = (user, enquiryDetails) => {
    const url = `${environment.empApiUrl}api/PresalesDashboard/GetSMSDetails/UserId,EntityId,UserType?UserId=${user.UserId}&EntityId=${enquiryDetails.EnquiryId}&UserType=${enquiryDetails.UserType}`;
    return this.http.get(url).pipe(map(x => x));
  }
  getEmailDetails = (user, leadDetail,Input) => {
    if(leadDetail.Email)
    {
      const url = `${environment.marketingApiUrl}api/Admin/SelectEmailLog/UserId,EntityId,UserType?UserId=${user.UserId}&EmailTo=${leadDetail.Email}&UserType=${leadDetail.UserType}&Input=${Input}`;
      return this.http.get(url).pipe(map(x => x));
    }
  }
  mergeLeadToBeDeleted = (user, id, EnquiryDetails) => {
    let data = {
      enquiryId: EnquiryDetails.EnquiryId,
      enquiryMergeId: id,
      id: user.UserId,
      Entityid: user.EntityId
    }
    const url = `${environment.empApiUrl}api/PresalesDashboard/MergeEnquiry/UserId,EntityId,UserType,EnquiryId,EnquiryMergeId?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}`;
    return this.http.put(url, data).pipe(map(x => x), take(1));
  }
  offlineCallDetails = (user, enquiryDetails, offlineCallDetails) => {
    let data = {
      offlineCallParameter: {
        to: enquiryDetails.MobileNo,
        from: user.MobileNo,
        callerEntityId: enquiryDetails.EnquiryId,
        callerUserType: enquiryDetails.UserType,
        entityId: user.EntityId,
        userType: user.UserType,
        startTime: offlineCallDetails.startTime ? offlineCallDetails.startTime : null,
        duration: offlineCallDetails.duration,
        status: offlineCallDetails.status,
        direction: offlineCallDetails.direction,
        callUrl: offlineCallDetails.url ? offlineCallDetails.url : null,
        UserId: user.UserId,
        tenantId: user.TenantId
      },
      file: []
    }
    const url = `${environment.empApiUrl}api/Employees/OfflineCall/UserId,UserType,EntityId`;
    return this.http.post(url, data).pipe(map(x => x), take(1));
  }

  callObservation = (user, EnquiryDetails) => {
    const url = `${environment.empApiUrl}api/PresalesDashboard/CallObservation/UserId,EntityId,UserType?UserId=${user.UserId}&EntityId=${EnquiryDetails.EnquiryId}&UserType=${'Enquiry'}&TenantId=${user.TenantId}`;
    return this.http.get(url).pipe(map(x => x));
  }
  getMasterData = (user, Input, CallId) => {
    const url = `${environment.empApiUrl}api/DPMPresale/GetCallRatingValues/UserId,UserType,EntityId?UserId=${user.UserId}&UserType=${user.UserType}&EntityId=${user.EntityId}&Input=${Input}&CallId=${CallId}&TenantId=${user.TenantId}`;
    return this.http.get(url).pipe(map(x => x));
  }
  InsertUpdatecallrating = (user, data, Id, ratingDetails) => {
    let insertData = {
      callId: data.CallId,
      crSubMasterId: Id,
      remark: data.Remark,
      score: ratingDetails,
      id: user.UserId,
      entityId: data.EntityId, // referral or enquiry
      userType: data.UserType, // referral or enquiry
      creatorId: user.EntityId,
      creatorUserType: user.UserType,
      autoFail1: data.AutoFail1 ? data.AutoFail1 : false,
      autoFail2: data.AutoFail2 ? data.AutoFail2 : false
    }
    let url = `${environment.empApiUrl}api/DPMPresale/InsertUpdate_CallRating/UserId,EntityId,UserType?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}`;
    return this.http.put(url, insertData).pipe(map(x => x), take(1));
  }

}
