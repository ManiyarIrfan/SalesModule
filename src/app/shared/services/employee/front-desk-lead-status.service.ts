import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FrontDeskLeadStatusService {

  constructor(private http: HttpClient) { }
  getTodaysCreatedLead = (user, startDate, endDate) => {
    const url = `${environment.empApiUrl}api/LeadDashboard/GetLeadsFrontDesk/UserId,EntityId,UserType?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}&TenantId=${user.TenantId}&FromDate=${startDate}&ToDate=${endDate}`
    return this.http.get(url).pipe(map(x => x));
  }
  getReportMarketingAnalysis = (user, startDate, endDate) => {
    const url = `${environment.empApiUrl}api/LeadDashboard/GetReportMarketingAnalysis/UserId,EntityId,UserType,FromDate,ToDate?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}&TenantId=${user.TenantId}&FromDate=${startDate}&ToDate=${endDate}`
    return this.http.get(url).pipe(map(x => x));
  }
  getReportSummery = (user, startDate, endDate) => {
    const url = `${environment.empApiUrl}api/LeadDashboard/GetLeadsFrontDeskSummary/UserId,EntityId,UserType?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}&TenantId=${user.TenantId}&FromDate=${startDate}&ToDate=${endDate}`
    return this.http.get(url).pipe(map(x => x));
  }

}
