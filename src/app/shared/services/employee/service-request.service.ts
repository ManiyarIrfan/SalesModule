import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ServiceRequestService {

  constructor(private http: HttpClient) { }

  GetProjectNameList = (user) => {
    const url = `${environment.apiUrl}api/ProjectDetails/GetAll/ProjectNames/UserId,EntityId,UserType?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}&TenantId=${user.TenantId}`;
    return this.http.get(url).pipe(map(x => x));
  }
  GetAllServiceRequest = (user) => {
    const url = `${environment.apiUrl}api/ServiceRequest/GetAll/UserId,EntityId,UserType?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}&TenantId=${user.TenantId}`;
    return this.http.get(url).pipe(map(x => x));
  }
  InsertreportIsuueDetails = (reportIssueModel, updateIssueModel, uploadServiceRequestImages, user, selectedUser) => {
    let data = {
      serviceRequestModelInsert: {
        Id: user.UserId,
        UserType: selectedUser.userType ? selectedUser.userType : user.UserType,
        entityId: selectedUser.entityId ? selectedUser.entityId : user.EntityId,
        projectname: reportIssueModel.ProjectName,
        building: reportIssueModel.Building,
        flat: reportIssueModel.Flat,
        issuetype: reportIssueModel.IssueType,
        issuesubject: reportIssueModel.IssueSubject,
        details: updateIssueModel.Details,
        issueDate: reportIssueModel.IssueDate
      },
      files: uploadServiceRequestImages,
    }
    let url = `${environment.apiUrl}api/ServiceRequest/Insert/UserId,EntityId,UserType?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}&TenantId=${user.TenantId}&DeviceDetails=${user.DeviceDetails}`;
    return this.http.post(url, data).pipe(map(x => x), take(1));
  }
  updateReportIsuueDetails = (user, reportIssueModel, updateIssueModel, deleteImageUrlList, uploadServiceRequestImages) => {
    let data = {
      serviceRequestUpdate: {
        Id: user.UserId,
        UserType: user.UserType,
        entityId: user.EntityId,
        issueId: reportIssueModel.IssueId,
        projectname: reportIssueModel.ProjectName,
        building: reportIssueModel.Building,
        flat: reportIssueModel.Flat,
        issuetype: reportIssueModel.IssueType,
        issuesubject: reportIssueModel.IssueSubject,
        details: updateIssueModel.Details,
        issueDate: reportIssueModel.IssueDate,
        IssueStatus: reportIssueModel.IssueStatus,
        assignedTo: reportIssueModel.AssignedTo,
      },
      file: uploadServiceRequestImages,
      deletefileurl: deleteImageUrlList,
      dbimageurllist: reportIssueModel.ImageUrl
    }
    let url = `${environment.apiUrl}api/ServiceRequest/Update/UserId,EntityId,UserType?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}&DeviceDetails=${user.DeviceDetails}`;
    return this.http.put(url, data).pipe(map(x => x), take(1));
  }

}
