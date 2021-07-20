import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EmpInteractionService {

  constructor(private http: HttpClient) { }

  getInteractionDetails = (user) => {
    const url = `${environment.empApiUrl}api/Interaction/GetEmployee/UserId,EntityId,UserType?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}`
    return this.http.get(url).pipe(map(x => x));
   }
  getCustomerInteractionDetails = (user) => {
    const url =  `${environment.empApiUrl}api/Interaction/GetEntity/UserId,EntityId,UserType?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}`
    return this.http.get(url).pipe(map(x => x));
  }

}

