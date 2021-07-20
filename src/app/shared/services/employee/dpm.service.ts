import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DpmService {

  constructor(private http: HttpClient) { }
  InsertPresalesSchedule = (user, Model, startDate, endDate, Input, startTime, endTime, Status) => {
    let data = {
      input: Input,
      employeeId: user.EntityId,
      startTime: startTime,
      endTime: endTime,
      scheduleStartDate: startDate,
      scheduleEndDate: endDate,
      id: user.UserId,
      tenantId: user.TenantId,
      status: Status,
      reScheduleId: Model.reScheduleId,
      eScheduleId: Model.eScheduleId,
    }
    let url = `${environment.empApiUrl}api/DPMPresale/EmployeeScheduleInsertUpdate/UserId,EntityId,UserType?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}`;
    return this.http.post(url, data).pipe(map(x => x), take(1));
  }
  displayPresalesSchedule = (user, startDate, endDate) => {
    const url = `${environment.empApiUrl}api/DPMPresale/EmployeeScheduleSelect/UserId,EntityId,UserType,FromDate,ToDate?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}&FromDate=${startDate}&ToDate=${endDate}&EmployeeId=${user.EntityId}&tenantId=${user.TenantId}&Status=${'Approved'}`;
    return this.http.get(url).pipe(map(x => x));
  }
  getEmployeeIncentive = (user, startDate, endDate) => {
    const url = `${environment.empApiUrl}api/DPMPresale/EmployeeTotalIncentive/UserId,UserType,EntityId?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}&FromDate=${startDate}&ToDate=${endDate}&EmployeeId=${user.EntityId}`;
    return this.http.get(url).pipe(map(x => x));
  }
  PresalesPendingSchedule = (user, startDate, endDate) => {
    const url = `${environment.empApiUrl}api/DPMPresale/EmployeeScheduleSelect/UserId,EntityId,UserType,FromDate,ToDate?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}&FromDate=${startDate}&ToDate=${endDate}&EmployeeId=${user.EntityId}&tenantId=${user.TenantId}&Status=${'Pending'}`;
    return this.http.get(url).pipe(map(x => x));
  }
  getIncentiveDetails = (user, header, startDate, endDate) => {
    const url = `${environment.empApiUrl}api/DPMPresale/GetAllIncentiveDetails/UserId,UserType,EntityId?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}&EmployeeId=${user.EntityId}&IncentiveOn=${header}&FromDate=${startDate}&ToDate=${endDate}`;
    return this.http.get(url).pipe(map(x => x));
  }
  getEmployeeList = (user) => {
    const url = `${environment.empApiUrl}api/EmployeeAdmin/GetEmployeeList/UserId,EntityId,UserType?UserType=${user.UserType}`;
    return this.http.get(url).pipe(map(x => x));
  }
  public jwt() {
    if (localStorage.getItem('LoggedinUser') && JSON.parse(localStorage.getItem('LoggedinUser'))) {
      return {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': "Bearer " + JSON.parse(localStorage.getItem('LoggedinUser')).token
        })
      }
    }
  }
}
