import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class IssueTrackService {

  constructor(private http: HttpClient) { }
  GetIssueDetails = (user, fromDate, toDate) => {
    const url = `${environment.empApiUrl}api/EmployeeAdmin/GetApplicationLogDetails/UserId,EntityId,UserType,FromDate,ToDate?UserId=${user.Id}&EntityId=${user.EntityId}&UserType=${user.UserType}&FromDate=${fromDate}&ToDate=${toDate}`;
    return this.http.get(url).pipe(map(x => x));
  }

  UpdatetIssueDetails = (user, details) => {
    let data = {
      Id: details.Id,
      Status: details.Status
    }
    let url = `${environment.empApiUrl}api/EmployeeAdmin/ApplicationLogUpdate/UserId,EntityId,UserType?UserId=${user.Id}&EntityId=${user.EntityId}&UserType=${user.UserType}`;
    return this.http.put(url, data).pipe(map(x => x), take(1));
  }
  
}
