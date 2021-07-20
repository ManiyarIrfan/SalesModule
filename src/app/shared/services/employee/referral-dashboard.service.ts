import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ReferralDashboardService {

  constructor(private http: HttpClient) { }
  getReportReferralDetails = (user, Reportname, status, startDate, endDate) => {
    const url = `${environment.empApiUrl}api/LeadDashboard/GetByName/UserId,EntityId,UserType?UserId=${user.UserId}&EntityId=${status === 'All' ? 0 : user.EntityId}&UserType=${user.UserType}&TenantId=${user.TenantId}&ID=${Reportname}&Status=${status}&ToDate=${endDate}&FromDate=${startDate}`
    return this.http.get(url).pipe(map(x => x));
  }
  // getReferralDetails = (user) => {
  //   const url =  `${environment.empApiUrl}api/LeadDashboard/GetALLById/UserId,EntityId,UserType?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}`
  //     return this.http.get(url).pipe(map(x => x));
  // }
  // getReferralDetailsPresales = (user) => {
  //   const url =  `${environment.empApiUrl}api/PresalesDashboard/PresalesReferralSearch/UserId,EntityId,UserType?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}`
  //      return this.http.get(url).pipe(map(x => x));
  // }
  GetSelectedReporting = (user) => {
    const url = `${environment.empApiUrl}api/LeadDashboard/ReportingToName/UserId,EntityId,UserType?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}`;
    return this.http.get(url).pipe(map(x => x));
  }

}
