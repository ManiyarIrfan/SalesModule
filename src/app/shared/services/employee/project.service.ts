import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  constructor(private http: HttpClient) { }

  getProjectNameValidation = (user, projectname, Input) => {
    const url = `${environment.empApiUrl}api/ProjectMaster/GetDuplicateProjectName/UserId,EntityId,UserType,ProjectName?ProjectName=${projectname}&Input=${Input}&EntityId=${user.EntityId}&UserType=${user.UserType}&TenantId=${user.TenantId}`;
    return this.http.get(url).pipe(map(x => x));
  }
  GetAllProject = (user) => {
    const url = `${environment.apiUrl}api/ProjectDetails/GetAll/ProjectNames/UserId,EntityId,UserType?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}&TenantId=${user.TenantId}`;
    return this.http.get(url).pipe(map(x => x));
  }
  InsertProjectlinks = (user, Model) => {
    let data = {
      id: user.UserId,
      phase1Id: Model.Phase1,
      executionId: Model.Phase2,
      dndId: Model.Dnd,
      type: 'Project',
      tenantId: Model.TenantId
    }
    let url = `${environment.empApiUrl}api/ProjectMaster/InsertProjectMapping/UserId,EntityId,UserType?UserId=${user.UserId}&TenantId=${user.TenantId}&EntityId=${user.EntityId}&UserType=${user.UserType}`;
    return this.http.post(url, data).pipe(map(x => x));
  }

  GetAllProjectName = (user) => {
    const url = `${environment.empApiUrl}api/ProjectMaster/GetExecutionDndProjetctID/UserId,EntityId,UserType?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}&TenantId=${user.TenantId}`;
    return this.http.get(url).pipe(map(x => x));
  }
  GetPhase1Projects = (user, Model) => {
    const url = `${environment.empApiUrl}api/ProjectMaster/GetPhase1ProjectId/UserId,EntityId,UserType?&Input=${Model.Input}&UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}&TenantId=${user.TenantId}&ProjectId=${Model.ProjectId}&type=${Model.type}`;
    return this.http.get(url).pipe(map(x => x));
  }
  InsertProjectDetails = (projectInsertModal, user) => {
    let data = {
      Id: user.UserId,
      TenantId: user.TenantId,
      UserType: user.UserType,
      entityId: user.EntityId,
      projectname: projectInsertModal.ProjectName,
      projecttype: projectInsertModal.ProjectType,
      rate: projectInsertModal.Rate,
      reraapproval: projectInsertModal.ReraApproval,
      reraregistrationno: projectInsertModal.ReraRegistrationNo,
      totalbuilding: projectInsertModal.TotalBuilding,
      noofflat: projectInsertModal.NoOfFlat,
      address1: projectInsertModal.Address1,
      address2: projectInsertModal.Address2,
      landmark: projectInsertModal.Landmark,
      location: projectInsertModal.Location,
      city: projectInsertModal.City,
      state: projectInsertModal.State,
      country: projectInsertModal.Country,
      pincode: projectInsertModal.PinCode,
      avgRate: projectInsertModal.AvgRate,
      DndProjectId: projectInsertModal.Dnd,
      ExecutionProjectId: projectInsertModal.Phase2,
    }
    let url = `${environment.empApiUrl}api/ProjectMaster/InsertProjectMasterData/UserId,EntityId,UserType?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}&TenantId=${user.TenantId}&DeviceDetails=${user.DeviceDetails}`;
    return this.http.post(url, data).pipe(map(x => x), take(1));
  }
  UpdateProjectDetails = (projectModal, user) => {
    let data = {
      Id: user.UserId,
      UserType: user.UserType,
      entityId: user.EntityId,
      projectId: projectModal.ProjectId,
      projectname: projectModal.ProjectName,
      projecttype: projectModal.ProjectType,
      rate: projectModal.Rate,
      reraapproval: projectModal.ReraApproval,
      reraregistrationno: projectModal.ReraRegistrationNo,
      totalbuilding: projectModal.TotalBuilding,
      noofflat: projectModal.NoOfFlat,
      address1: projectModal.Address1,
      address2: projectModal.Address2,
      landmark: projectModal.Landmark,
      location: projectModal.Location,
      city: projectModal.City,
      state: projectModal.State,
      country: projectModal.Country,
      pincode: projectModal.PinCode,
      avgRate: projectModal.AvgRate
    }
    let url = `${environment.empApiUrl}api/ProjectMaster/Update/UserId,EntityId,UserType?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}&TenantId=${user.TenantId}`;
    return this.http.put(url, data).pipe(map(x => x), take(1));
  }
  InsertMilestone = (user, details) => {
    let data = {
      stages: details.MilestoneName ? details.MilestoneName : null,
      percentage: details.Percentage ? details.Percentage : null,
      details: details.Details ? details.Details : null,
      projectId: details.ProjectId ? details.ProjectId : null,
      id: user.UserId ? user.UserId : null,
    }
    let url = `${environment.empApiUrl}api/ProjectStatus/InsertPaymentMilestone/UserId,EntityId,UserType?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}&TenantId=${user.TenantId}`;
    return this.http.post(url, data).pipe(map(x => x), take(1));
  }
  GetAllMilestoneData = (user,ProjectId) => {
    const url = `${environment.empApiUrl}api/ProjectStatus/GetPaymentMilestone/UserId?&UserId=${user.UserId}&TenantId=${user.TenantId}&ProjectId=${ProjectId}`;
    return this.http.get(url).pipe(map(x => x));
  }
  MilestoneValidation = (name,projectid) => {
    const url = `${environment.apiUrl}api/IsDuplicate/emailId?ProjectId=${projectid}&PanNumber=${name}&Input=${'MilestoneNameDuplication'}`;
    return this.http.get(url).pipe(map(x => x));
  }

}

