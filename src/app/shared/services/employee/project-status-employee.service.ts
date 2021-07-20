import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map, take } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class ProjectStatusEmployeeService {

  constructor(private http: HttpClient) { }

  GetProjectNameList = (user) => {
    const url = `${environment.apiUrl}api/ProjectDetails/GetAll/ProjectNames/UserId,EntityId,UserType?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}&TenantId=${user.TenantId}`;
    return this.http.get(url).pipe(map(x => x));
  }
  GetBuildingTypeByProjectName = (user, selectedProjectNames) => {
    const url = `${environment.empApiUrl}api/ProjectStatus/GetBuildingType/UserId,EntityId,UserType,ProjectName?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}&TenantId=${user.TenantId}&ProjectName=${selectedProjectNames}`;
    return this.http.get(url).pipe(map(x => x));
  }
  GetAllProjectStutas = (user) => {
    const url = `${environment.apiUrl}api/ProjectStatus/GetAll/UserId,UserType,EntityId?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}&TenantId=${user.TenantId}`;
    return this.http.get(url).pipe(map(x => x));
  }
  GetPhase1Projects = (user, Model) => {
    const url = `${environment.empApiUrl}api/ProjectMaster/GetPhase1ProjectId/UserId,EntityId,UserType?&Input=${Model.Input}&UserId=${user.UserId}&EntityId=${user.EntityId}&TenantId=${user.TenantId}&UserType=${user.UserType}&ProjectId=${Model.SubProjectId}&type=${Model.type}&Phase1Id=${Model.ProjectId}`;
    return this.http.get(url).pipe(map(x => x));
  }
  GetAllProjectName = (user) => {
    const url = `${environment.empApiUrl}api/ProjectMaster/GetExecutionDndProjetctID/UserId,EntityId,UserType?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}&TenantId=${user.TenantId}`;
    return this.http.get(url).pipe(map(x => x));
  }

  getSubProjectNameValidation = (model) => {
    const url = `${environment.empApiUrl}api/ProjectMaster/GetDuplicateProjectName/UserId,EntityId,UserType,ProjectName?SubProjectName=${model.BuildingType}&Input=${model.Input}&ProjectName=${model.ProjectName}`;
    return this.http.get(url).pipe(map(x => x));
  }
  InsertProjectStatus = (ProjectStatusModel, uploadProjectStatusImages, displayArray, user, linkProjectModel) => {
    let data = {
      projectStatusInsertModel: {
        Id: user.UserId,
        UserType: user.UserType,
        entityId: user.EntityId,
        projectname: ProjectStatusModel.ProjectName,
        buildingtype: ProjectStatusModel.BuildingType,
        currentstatus: ProjectStatusModel.CurrentStatus,
        currentprice: ProjectStatusModel.CurrentPrice,
        pricerevision: ProjectStatusModel.PriceRevision,
        estimationcompletiondates: ProjectStatusModel.EstimationCompletionDates,
        plannedactivity: displayArray,
        ExecutionSubProjectId  : linkProjectModel.exeSubProject,
        DndSubProjectId : linkProjectModel.dndSubProject,
      },
      file: uploadProjectStatusImages
    }
    let url = `${environment.empApiUrl}api/ProjectStatus/Insert/UserId,EntityId,UserType?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}&DeviceDetails=${user.DeviceDetails}`;
    return this.http.post(url, data).pipe(map(x => x));
  }
  InsertProjectlinks = (user, Model) => {
    let data = {
      id: user.UserId,
      phase1Id: Model.SubProjectId,
      executionId: Model.exeSubProject,
      dndId: Model.dndSubProject,
      type: Model.type,
      tenantId:Model.TenantId
    }
    let url = `${environment.empApiUrl}api/ProjectMaster/InsertProjectMapping/UserId,EntityId,UserType?UserId=${user.UserId}&TenantId=${user.TenantId}&EntityId=${user.EntityId}&UserType=${user.UserType}`;
    return this.http.post(url, data).pipe(map(x => x));
  }
  updateProjectStatus = (user, ProjectStatusModel, displayArray, deleteImageUrlList, uploadProjectStatusImages, imageUrlList) => {
    let data = {
      projectStatusUpdate: {
        Id: user.UserId,
        UserType: user.UserType,
        entityId: user.EntityId,
        projectname: ProjectStatusModel.ProjectName,
        buildingtype: ProjectStatusModel.BuildingType,
        currentstatus: ProjectStatusModel.CurrentStatus,
        currentprice: ProjectStatusModel.CurrentPrice,
        pricerevision: ProjectStatusModel.PriceRevision,
        estimationcompletiondates: ProjectStatusModel.EstimationCompletionDates,
        plannedactivity: displayArray
      },
      file: uploadProjectStatusImages,
      deletefileurl: deleteImageUrlList,
      dbimageurllist: imageUrlList
    }
    const url = `${environment.empApiUrl}api/ProjectStatus/Update/UserId,EntityId,UserType?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}`;
    return this.http.put(url, data).pipe(map(x => x));
  }
}
