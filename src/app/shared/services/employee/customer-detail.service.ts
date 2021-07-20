import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CustomerDetailService {

  constructor(private http: HttpClient) { }

  getCustomerViewDetails = (user) => {
    const url = `${environment.empApiUrl}api/EmployeeDashboard/CustomerViewDetails/GetById/UserId,UserType,EntityId?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}`
    return this.http.get(url).pipe(map(x => x));
  }
  sendEmail = (sessionModel, user, emailmodel) => {
    let data = {
      to: sessionModel.UserId,
      cc: user.UserEmail,
      subject: emailmodel.Subject,
      body: emailmodel.Details
    }
    let url = `${environment.empApiUrl}api/Employees/SendEmail/UserId,UserType,EntityId?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}`;
    return this.http.post(url, data).pipe(map(x => x), take(1));
  }
  onCall = (user, to, from) => {
    let data = {
      Id: user.UserId,
      UserType: user.UserType,
      entityId: user.EntityId,
      to: to,
      from: from
    }
    let url = `${environment.empApiUrl}api/Employees/CallCustomer/UserId,UserType,EntityId?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}&TenantId=${user.TenantId}`;
    return this.http.post(url, data).pipe(map(x => x));
  }

}
