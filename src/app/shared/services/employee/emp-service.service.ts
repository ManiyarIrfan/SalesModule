import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EmpServiceService {

  constructor(private http: HttpClient) { }
  getServiceDetails = (user) => {
    const url = `${environment.empApiUrl}api/EmployeeDashboard/ServiceRequest/GetByEmployeeId/UserId,UserType,EntityId?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}`
    return this.http.get(url).pipe(map(x => x));
  }
  getServiceDetailsforCustomer = (user) => {
    const url = `${environment.empApiUrl}api/EmployeeDashboard/ServiceRequest/GetById/UserId,UserType,EntityId?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}`
    return this.http.get(url).pipe(map(x => x));
  }
}
