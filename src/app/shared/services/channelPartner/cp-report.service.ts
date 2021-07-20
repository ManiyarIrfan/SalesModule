import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CpReportService {

  constructor(private http: HttpClient) { }
  GetCpReports = (user, dateObj) => {
    const url = `${environment.channelApiUrl}api/ChannelPartnersReport/getReport/UserId,EntityId,UserType,StartDate,EndDate?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}&StartDate=${dateObj.StartDate}&EndDate=${dateObj.EndDate}`;
    return this.http.get(url).pipe(map(x => x));
  }

  getDuplicateRecords = (user) => {
    const url =  `${environment.channelApiUrl}api/ChannelPartnersReport/GetDuplicateLeadReport/UserId,EntityId,UserType?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}`;
    return this.http.get(url).pipe(map(x => x));
  }

}
