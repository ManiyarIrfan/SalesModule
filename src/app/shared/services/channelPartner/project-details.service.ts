import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProjectDetailsService {

  constructor(private http: HttpClient) { }

  GetPreferredLocation = (user) => {
    const url = `${environment.apiUrl}api/ProjectDetails/GetLocations/UserId,EntityId,UserType?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}&TenantId=${user.TenantId}`;
    return this.http.get(url).pipe(map(x => x));
  }
  GetProjectListOnSelectedLocation = (user, selectedLocation) => {
    const url = `${environment.apiUrl}api/ProjectDetails/GetProjectNames/UserId,EntityId,UserType,location?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}&TenantId=${user.TenantId}&location=${selectedLocation}`;
    return this.http.get(url).pipe(map(x => x));
  }
  GetBHKDetailsOnSelectedProject = (user, selectedProject) => {
    const url = `${environment.apiUrl}api/ProjectDetails/GetBHK/UserId,EntityId,UserType,ProjectName?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}&TenantId=${user.TenantId}&ProjectName=${selectedProject}`;
    return this.http.get(url).pipe(map(x => x));
  }
  GetSerarchedProjectDetails = (user, selectedFilter) => {
    const url = `${environment.apiUrl}api/ProjectDetails/GetProjectDetail/UserId,EntityId,UserType,Location,ProjectName,BHK?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}&TenantId=${selectedFilter.TenantId}&location=${selectedFilter.preferredLocation}&ProjectName=${selectedFilter.preferredProjects}&BHK=${selectedFilter.preferredBHK}`;
    return this.http.get(url).pipe(map(x => x));
  }
  GetBrochureNameList = (user, selectedProject, Brochure) => {
    const url = `${environment.empApiUrl}api/Employees/GetBroucherByProjectName/UserId,UserType,EntityId,ProjectName,IsBrochure,ContentType?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}&ProjectName=${selectedProject}&IsBrochure=${Brochure}`;
    return this.http.get(url).pipe(map(x => x));
  }
  GetFlatCounterDetails = (user, selectbuilding, selectFilter) => {
    let data = {
      Id: user.UserId,
      UserType: user.UserType,
      entityId: user.EntityId,
      ProjectName: selectFilter.preferredProjects,
      BuildingType: selectbuilding.BuildingType,
      FlatNo: selectbuilding.FlatNo
    }
    let url = `${environment.channelApiUrl}api/ChannelPartner/UpdateProjectStatusCounter/UserId,EntityId,UserType?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}`;
    return this.http.put(url, data).pipe(map(x => x), take(1));
  }
  GetFlatDetails = (user, selectedbuilding, selectedFilter) => {
    const url = `${environment.channelApiUrl}api/ChannelPartner/GetProjectStatus/UserId,EntityId,UserType,ProjectName,BuildingType,FlatNo?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}&ProjectName=${selectedFilter.preferredProjects}&BuildingType=${selectedbuilding.BuildingType}&FlatNo=${selectedbuilding.FlatNo}`;
    return this.http.get(url).pipe(map(x => x));
  }
  FlatBlockUnblock = (user, projectDetails) => {
    let data = {
      Id: user.UserId,
      UserType: user.UserType,
      entityId: user.EntityId,
      projectId: projectDetails.ProjectId,
      buildingType: projectDetails.BuildingType,
      flatNo: projectDetails.FlatNo,
      availibility: projectDetails.Available
    }
    let url = `${environment.empApiUrl}api/ProjectDetails/UpdateFlatAvailibility/UserId,EntityId,UserType?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}`;
    return this.http.put(url, data).pipe(map(x => x), take(1));
  }
}
