import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map, take } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class ReportIssueService {

  constructor(private http: HttpClient) { }

  GetProjectNameList = (user) => {
    const url =  `${environment.apiUrl}api/ProjectDetails/GetAll/ProjectNames/UserId,EntityId,UserType?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}&TenantId=${user.TenantId}`;
    return this.http.get(url).pipe(map(x => x));
  }
  GetServiceRequestByEntityId = (user) => {
    const url =   `${environment.apiUrl}api/ServiceRequest/GetById/UserId,EntityId,UserType?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}`;
    return this.http.get(url).pipe(map(x => x));
  }
  InsertreportIsuueDetails = (reportIssueModel, sessionModel, user, filesModel) => {
    let data = {
      serviceRequestModelInsert: {
        Id: user.UserId,
        userType: user.UserType,
        entityId: sessionModel.EntityId,
        projectName: reportIssueModel.ProjectName,
        building: reportIssueModel.Building,
        flat: reportIssueModel.Flat,
        issueType: reportIssueModel.IssueType,
        issueSubject: reportIssueModel.IssueSubject,
        details: reportIssueModel.Details,
        issueDate: reportIssueModel.IssueDate
      },
      files: filesModel
    }    
    let url = `${environment.apiUrl}api/ServiceRequest/Insert/UserId,EntityId,UserType?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}&TenantId=${user.TenantId}&DeviceDetails=${user.DeviceDetails}`;
    return this.http.post(url, data).pipe(map(x => x), take(1));
  }
  
}
