import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PreSalesLeadsService {

  constructor(private http: HttpClient) { }

  getSourceCampaign = (user, Type) => {
    const url = `${environment.empApiUrl}api/EmployeeAdmin/GetSourceCampaign/UserId,EntityId,UserType,Type?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}&Type=${Type ? Type : ''}&TenantId=${user.TenantId}`;
    return this.http.get(url).pipe(map(x => x));
  }
  GetSelectedReporting = (user) => {
    const url = `${environment.empApiUrl}api/LeadDashboard/ReportingToName/UserId,EntityId,UserType?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}&TenantId=${user.TenantId}`;
    return this.http.get(url).pipe(map(x => x));
  }
  getAllPresalesLead = (user, presalesInfoModel, StartDate, EndDate) => {
    // const url = `${environment.tempempApiUrl}api/PresalesDashboard/GetAllEnquiry/UserId,EntityId,UserType,Status?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}&TenantId=${user.TenantId}&Status=${presalesInfoModel.Status}&AssignedTo=${presalesInfoModel.reportingNameId}&FromDate=${StartDate}&ToDate=$${EndDate}&ProjectId=${presalesInfoModel.ProjectId}`
    // return this.http.get(url).pipe(map(x => x));
    let data = {
      'enquirySelectParameter': {
        entityId: user.EntityId,
        userType: user.UserType,
        status: presalesInfoModel.Status,
        assignedTo: presalesInfoModel.reportingNameId,
        fromDate: StartDate,
        toDate: EndDate,
        projectId: presalesInfoModel.ProjectId ? presalesInfoModel.ProjectId : null,
        tenantId: user.TenantId
      },
      'userParameter': {
        userId: user.UserId,
        entityId: user.EntityId,
        userType: user.UserType,
        tenantId: user.TenantId,
        userDetail: user.UserDeatils
      }
    }
    let url = `${environment.empApiUrl}api/PresalesDashboard/GetAllEnquiry/UserId,EntityId,UserType,Status?UserId=${user.UserId}&UserType=${user.UserType}&EntityId=${user.EntityId}&TenantId=${user.TenantId}`;
    return this.http.post(url, data).pipe(map(x => x, take(1)));
  }
  GetAllProjectName = (user) => {
    const url = `${environment.apiUrl}api/ProjectDetails/GetAll/ProjectNames/UserId,EntityId,UserType?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}&TenantId=${user.TenantId}`;
    return this.http.get(url).pipe(map(x => x));
  }
  getAllUnqualifiedOrLostPresalesLead = (user, StartDate, EndDate, ProjectId, status) => {
    ProjectId = ProjectId ? ProjectId : null;
    const url = `${environment.empApiUrl}api/PresalesDashboard/UnQualifiedOrLostEnquiry_BySalesPresale/UserId,EntityId,UserType,FromDate,ToDate,Status?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}&TenantId=${user.TenantId}&StartDate=${StartDate}&EndDate=${EndDate}&Status=${status}&ProjectId=${ProjectId}`
    return this.http.get(url).pipe(map(x => x));
  }
  insertEnquiryRegistration = (enquiryRegModel, user) => {
    let data = {
      UserType: user.UserType,
      Id: user.UserId,
      EntityId: user.EntityId,
      firstname: enquiryRegModel.refFirst,
      lastname: enquiryRegModel.refLast,
      email: enquiryRegModel.refEmail,
      mobileno: enquiryRegModel.refMobileNo,
      city: enquiryRegModel.City,
      preferredcity: enquiryRegModel.preCity,
      preferredproject: enquiryRegModel.PreferredProject,
      source: enquiryRegModel.Source,
      typeOfLead: enquiryRegModel.TypeOfLead,
      contactedBy: enquiryRegModel.ContactedBy,
      propertyType: enquiryRegModel.PropertyType,
      msgDetails: enquiryRegModel.MsgDetails,
      budget: enquiryRegModel.Budget,
      campaign: enquiryRegModel.Campaign,
      countryCode: enquiryRegModel.refCountryCode
    }
    let url = `${environment.empApiUrl}api/PresalesDashboard/InsertEnquiry/UserId,EntityId,UserType?UserId=${user.UserId}&UserType=${user.UserType}&EntityId=${user.EntityId}&TenantId=${user.TenantId}`;
    return this.http.post(url, data).pipe(map(x => x, take(1)));
  }

  multipleReassign = (user, enquiryRegModel) => {
    let data = {
      leadId: enquiryRegModel.enquiryIdList,
      employeeId: enquiryRegModel.PresalesAgentAssigned,
      input: enquiryRegModel.Input,
      id: user.UserId,
    }
    let url = `${environment.empApiUrl}api/PresalesDashboard/MultipleLeadsAssign/UserId,EntityId,UserType?UserId=${user.UserId}&UserType=${user.UserType}&EntityId=${user.EntityId}`;
    return this.http.put(url, data).pipe(map(x => x, take(1)));
  }

  getEnquirySummary = (user, StartDate, EndDate, SummaryName, ProjectId) => {
    const url = `${environment.empApiUrl}api/PresalesDashboard/EnquirySummaryByDateRange/UserId,EntityId,UserType,FromDate,ToDate,SummaryName,ProjectId?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}&TenantId=${user.TenantId}&FromDate=${StartDate}&ToDate=${EndDate}&SummaryName=${SummaryName}&ProjectId=${ProjectId}`;
    return this.http.get(url).pipe(map(x => x));
  }

  getEnquirySummaryDetail = (user, SummaryDetailModel, ProjectId) => {
    let body = {
      FromDate: SummaryDetailModel.StartDate,
      ToDate: SummaryDetailModel.EndDate,
      SummaryName: SummaryDetailModel.SummaryName,
      Value: SummaryDetailModel.Value,
      Status: SummaryDetailModel.Status,
      ProjectId: ProjectId
    }
    const url = `${environment.empApiUrl}api/PresalesDashboard/EnquirySummaryDetailByDate/UserId,EntityId,UserType?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}&TenantId=${user.TenantId}`;
    return this.http.post(url, body).pipe(map(x => x), take(1));
  }

}