import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DpmadminService {

  constructor(private http: HttpClient) { }
  InsertEmployee = (user, adminPanelModel) => {
    let data = {
      Id: user.UserId,
      firstname: adminPanelModel.FirstName,
      lastname: adminPanelModel.LastName,
      mobileno: adminPanelModel.MobileNo,
      email: adminPanelModel.Email,
      role: adminPanelModel.Role,
      assingedarea: adminPanelModel.AssingedArea,
      assingedproject1: adminPanelModel.AssingedProject1,
      assingedproject2: adminPanelModel.AssingedProject2,
      assingedproject3: adminPanelModel.AssingedProject3,
      reportingto: adminPanelModel.ReportingTo,
      level: adminPanelModel.Level,
      assingedcity: adminPanelModel.City,
      WeeklyOff: adminPanelModel.woff,
      noLeadsDay: adminPanelModel.wdays,
      switchRole: adminPanelModel.SwitchRole,
      employeeType: adminPanelModel.employeeType
    }
    let url = `${environment.empApiUrl}api/EmployeeAdmin/EmployeeRegistration/UserId,EntityId,UserType?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}`;
    return this.http.post(url, data).pipe(map(x => x), take(1));
  }
  InsertPresalesSchedule = (user, Model, startDate, endDate, Input, startTime, endTime, Status) => {
    let data = {
      input: Input,
      employeeId: (Model.Presales && Model.Presales !== "") ? Model.Presales : null,
      startTime: startTime,
      endTime: endTime,
      scheduleStartDate: startDate,
      scheduleEndDate: endDate,
      id: user.UserId,
      tenantId: user.TenantId,
      Status: Status,
      reScheduleId: Model.reScheduleId,
      eScheduleId: Model.eScheduleId,
    }
    let url = `${environment.empApiUrl}api/DPMPresale/EmployeeScheduleInsertUpdate/UserId,EntityId,UserType?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}`;
    return this.http.post(url, data).pipe(map(x => x), take(1));
  }
  UpdateIncentiveService = (user, Model, Input) => {
    let data = {
      input: Input,
      incentiveId: Model.IncentiveId,
      incentiveOn: null,
      price: Model.price,
      tenantId: user.TenantId,
      effectiveStartDate: Model.EffectiveStartDate,
      effectiveEndDate: Model.EffectiveEndDate,
      id: user.UserId,
      stdRate: Model.StdRate
    }
    let url = `${environment.empApiUrl}api/DPMPresale/IncentivePlanInsertUpdate/UserId,EntityId,UserType?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}`;
    return this.http.post(url, data).pipe(map(x => x), take(1));
  }
  getIncentiveNames = (user, startDate, endDate) => {
    const url = `${environment.empApiUrl}api/DPMPresale/GetAllIncentivePlan/UserId,EntityId,UserType?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}&TenantId=${user.TenantId}&StartDate${startDate}&EndDate${endDate}&TenantId=${user.TenantId}`;
    return this.http.get(url).pipe(map(x => x));
  }
  getActiveUsers = (user) => {
    const url = `${environment.empApiUrl}api/DPMPresale/UserLoginLogoutSelect/UserId,EntityId,UserType?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}&TenantId=${user.TenantId}`;
    return this.http.get(url).pipe(map(x => x));
  }
  displayPresalesSchedule = (user, startDate, endDate, searchDPMModel) => {
    const url = `${environment.empApiUrl}api/DPMPresale/EmployeeScheduleSelect/UserId,EntityId,UserType,FromDate,ToDate?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}&FromDate=${startDate}&ToDate=${endDate}&EmployeeId=${searchDPMModel.Presales}&tenantId=${user.TenantId}&Status=${'Approved'}`;
    return this.http.get(url).pipe(map(x => x));
  }
  getEmployeeIncentive = (user, startDate, endDate) => {
    const url = `${environment.empApiUrl}api/DPMPresale/EmployeeTotalIncentive/UserId,UserType,EntityId?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}&FromDate=${startDate}&ToDate=${endDate}`;
    return this.http.get(url).pipe(map(x => x));
  }
  getIncentiveDetails = (user, header, startDate, endDate) => {
    const url = `${environment.empApiUrl}api/DPMPresale/GetAllIncentiveDetails/UserId,UserType,EntityId?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}&EmployeeId=${user.EmployeeId}&IncentiveOn=${header}&FromDate=${startDate}&ToDate=${endDate}`;
    return this.http.get(url).pipe(map(x => x));
  }
  PresalesPendingSchedule = (user, startDate, endDate, searchDPMModel) => {
    const url = `${environment.empApiUrl}api/DPMPresale/EmployeeScheduleSelect/UserId,EntityId,UserType,FromDate,ToDate?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}&FromDate=${startDate}&ToDate=${endDate}&EmployeeId=${searchDPMModel.Presales}&tenantId=${user.TenantId}&Status=${'Pending'}`;
    return this.http.get(url).pipe(map(x => x));
  }
  getEmployeeList = (user) => {
    const url = `${environment.empApiUrl}api/EmployeeAdmin/GetEmployeeList/UserId,EntityId,UserType?UserType=${user.UserType}`;
    return this.http.get(url).pipe(map(x => x));
  }

}
