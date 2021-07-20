import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map, take } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class ReferralStatusService {

  constructor(private http: HttpClient) { }

  GetReferralStatusDetails = (user) => {
    const url =  `${environment.apiUrl}api/ReferralStatus/GetReferralStatusById/UserId,EntityId,UserType?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}`;
    return this.http.get(url).pipe(map(x => x));
  }

}
