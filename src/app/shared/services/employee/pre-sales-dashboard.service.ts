import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PreSalesDashboardService {

  constructor(private http: HttpClient) { }

  total_Count = (user) => {
    const url = `${environment.empApiUrl}api/PresalesDashboard/CountTotal/UserId,EntityId,UserType?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}&TenantId=${user.TenantId}`;
    return this.http.get(url).pipe(map(x => x));
  }
  DetailForModal = (user, status, startDate, endDate) => {
    const url = `${environment.empApiUrl}api/PresalesDashboard/GetDetailsForModal/UserId,EntityId,UserType,Status?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}&TenantId=${user.TenantId}&Status=${status}&StartDate=${startDate}&EndDate=${endDate}`;
    return this.http.get(url).pipe(map(x => x));
  }
  getAllPresalesLead = (user, status, StartDate, EndDate) => {
    // const url = `${environment.empApiUrl}api/PresalesDashboard/GetAllEnquiry/UserId,EntityId,UserType,Status?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}&TenantId=${user.TenantId}&Status=${status}&FromDate=${StartDate}&ToDate=${EndDate}&AssignedTo=${user.EntityId}`;
    // return this.http.get(url).pipe(map(x => x));
    let data = {
      'enquirySelectParameter': {
        entityId: user.EntityId,
        userType: user.UserType,
        status: status,
        assignedTo: user.EntityId,
        fromDate: StartDate,
        toDate: EndDate,
        // projectId: presalesInfoModel.ProjectId ? presalesInfoModel.ProjectId : null,
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

  SelectPreSalesDashboardReport = (user, InputModel) => {
    let data = {
      EntityId: InputModel.EntityId,
      FromDate: InputModel.FromDate ? InputModel.FromDate : null,
      ToDate: InputModel.ToDate ? InputModel.ToDate : null,
      ProjectId: InputModel.ProjectId ? InputModel.ProjectId : null,
      UserType: InputModel.FromDate ? InputModel.FromDate : null,
      TenantId: user.TenantId ? user.TenantId : null,
      Status: InputModel.Status ? InputModel.Status : null,
      Input: InputModel.Input
    }
    let url = `${environment.empApiUrl}api/PresalesDashboard/SelectPresalesDashboardReport/UserId,EntityId,UserType?UserId=${user.UserId}&UserType=${user.UserType}&EntityId=${user.EntityId}&TenantId=${user.TenantId}`;
    return this.http.post(url, data).pipe(map(x => x, take(1)));
  }
  GetAllProjectName = (user) => {
    const url = `${environment.apiUrl}api/ProjectDetails/GetAll/ProjectNames/UserId,EntityId,UserType?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}&TenantId=${user.TenantId}`;
    return this.http.get(url).pipe(map(x => x));
  }
}
