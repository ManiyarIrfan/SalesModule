import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PaymentScheduleService {

  constructor(private http: HttpClient) { }

  getOrder = (user) => {
    const url = `${environment.apiUrl}api/PaymentSchedule/GetById/UserId,EntityId,UserType?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}`;
    return this.http.get(url).pipe(map(x => x));
  }
  GetPaymentSchedule = (user, orderDetails) => {
    const url = `${environment.apiUrl}api/PaymentSchedule/GetByOrderId/UserId,EntityId,UserType,OrderId?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}&OrderId=${orderDetails}`;
    return this.http.get(url).pipe(map(x => x));
  }
  getFinancialStatus = (user, orderDetails) => {
    const url = `${environment.apiUrl}api/FinanceStatus/GetById/UserId,EntityId,UserType,OrderId?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}&OrderId=${orderDetails}`;
    return this.http.get(url).pipe(map(x => x));
  }

}
