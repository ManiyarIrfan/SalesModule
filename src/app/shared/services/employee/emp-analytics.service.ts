import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EmpAnalyticsService {

  constructor(private http: HttpClient) { }
  GetchartDetails = (user) => {
    const url = `${environment.empApiUrl}api/EmployeeDashboard/OrderStatus/UserId,UserType,EntityId?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}`;
    return this.http.get(url).pipe(map(x => x));
  }
  GetreferralchartDetails = (user) => {
    const url = `${environment.empApiUrl}api/EmployeeDashboard/ReferralStatus/UserId,UserType,EntityId?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}`;
    return this.http.get(url).pipe(map(x => x));
  }
  GetservicechartDetails = (user) => {
    const url = `${environment.empApiUrl}api/EmployeeDashboard/ServiceRequestStatus/UserId,UserType,EntityId?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}`;
    return this.http.get(url).pipe(map(x => x));
  }
  GetProjectList = (user) => {
    const url = `${environment.apiUrl}api/ProjectDetails/GetAll/ProjectNames/UserId,EntityId,UserType?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}&TenantId=${user.TenantId}`;
    return this.http.get(url).pipe(map(x => x));
  }
  getCampaignPlan = (user, SearchCampaignPlanModel) => {
    const url = `${environment.marketingApiUrl}api/Campaign/PlanMasterSearchSelect/UserId,EntityId,UserType?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}&Input=${SearchCampaignPlanModel.Input}&PlanId=${SearchCampaignPlanModel.PlanId}&PlanType=${SearchCampaignPlanModel.PlanType}
    &PlanName=${SearchCampaignPlanModel.PlanName}&
    &StartDate=${SearchCampaignPlanModel.StartDate}&EndDate=${SearchCampaignPlanModel.EndDate}
    &ChannelId=${SearchCampaignPlanModel.ChannelId}`;
    return this.http.get(url).pipe(map(x => x));
  }
  getRatio = (user, dates, searchProjectName, spend) => {
    const url = `${environment.empApiUrl}api/Ratio/RatioOnProjectAndDate/UserId,EntityId,UserType,FromDate,ToDate,ProjectName,Spend?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}&TenantId=${user.TenantId}&ToDate=${dates.endDate.format('YYYY-MM-DD')}&FromDate=${dates.startDate.format('YYYY-MM-DD')}&ProjectName=${searchProjectName}&Spend=${spend}&TenantId=${user.TenantId}`;
    return this.http.get(url).pipe(map(x => x));
  }
  Get_Count = (user, startDate, endDate) => {
    const url = `${environment.empApiUrl}api/EmployeeDashboard/GetCountForSalesDashboard/UserId,EntityId,UserType?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}&FromDate=${startDate}&ToDate=${endDate}`;
    return this.http.get(url).pipe(map(x => x));
  }
  DetailsForModal = (user, status, startDate, endDate) => {
    const url = `${environment.empApiUrl}api/EmployeeDashboard/ModalDetailsForSales/UserId,EntityId,UserType,TileName?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}&TileName=${status}&FromDate=${startDate}&ToDate=${endDate}`;
    return this.http.get(url).pipe(map(x => x));
  }
  getleadOnStatusDetails = (user, Reportname, status) => {
    const url = `${environment.empApiUrl}api/LeadDashboard/GetByName/UserId,EntityId,UserType?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}&TenantId=${user.TenantId}&ID=${Reportname}&Status=${status}`
    return this.http.get(url).pipe(map(x => x));
  }
  getCallReportsDetails = (user, selected, data) => {
    const body = {
      StartDate: selected.startDate ? selected.startDate.format('YYYY-MM-DD') : null,
      EndDate: selected.endDate ? selected.endDate.format('YYYY-MM-DD') : null,
      TenantId: user.TenantId ? user.TenantId : null,
      Level: user.Level ? user.Level : null,
      ProjectId: data.ProjectId ? data.ProjectId : null,
      PresalesId: data.PresalesId ? data.PresalesId : null,
      EntityId: user.EntityId ? user.EntityId : null
    }
    const url = `${environment.empApiUrl}api/Reporting/GetCallDetails/UserId,EntityId,UserType,StartDate,EndDate,Level?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}`;
    return this.http.post(url, body).pipe(map(x => x));
  }
  getCrmPopupDetails = (user, startDate, endDate, input) => {
    const url = `${environment.empApiUrl}api/CustomerOrder/CrmDashboardDetails/UserId,EntityId,UserType,FromDate,ToDate,Input?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}&FromDate=${startDate}&ToDate=${endDate}&Input=${input}`;
    return this.http.get(url).pipe(map(x => x));
  }
  getCrmDashboardDetails = (user, startDate, endDate) => {
    const url = `${environment.empApiUrl}api/CustomerOrder/CrmDashboardCount/UserId,EntityId,UserType,FromDate,ToDate?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}&FromDate=${startDate}&ToDate=${endDate}`;
    return this.http.get(url).pipe(map(x => x));
  }
  getFeedbackDetails = (user) => {
    const url = `${environment.empApiUrl}api/ProjectStatus/GetFeedBack/UserId?UserId=${user.UserId}&TenantId=${user.TenantId}`;
    return this.http.get(url).pipe(map(x => x));
  }
}
