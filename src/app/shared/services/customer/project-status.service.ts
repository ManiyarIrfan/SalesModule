import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProjectStatusService {

  constructor(private http: HttpClient) { }

  GetProjectStatusDetails = (user) => {
    const url = `${environment.apiUrl}api/ProjectStatus/GetById/UserId,EntityId,UserType?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}`;
    return this.http.get(url).pipe(map(x => x));
  }

  UpdateProjectStatusDetails = (user) => {
    let data = {
      Id: user.UserId,
      UserType: user.UserType,
      EntityId: user.EntityId
    }
    let url = `${environment.apiUrl}api/ProjectStatus/GetById/UserId,EntityId,UserType`;
    return this.http.post(url, data).pipe(map(x => x),take(1));
  }

}
