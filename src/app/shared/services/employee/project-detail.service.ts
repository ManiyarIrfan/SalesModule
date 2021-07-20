import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProjectDetailService {

  constructor(private http: HttpClient) { }

  OnSelectedBuildingtype = (user, selectedProjectName) => {
    const url =  `${environment.empApiUrl}api/ProjectDetails/GetProjectDetails/UserId,EntityId,UserType,ProjectName,BuildingType?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}&ProjectName=${selectedProjectName.ProjectName}&buildingType=${selectedProjectName.buildingType}`;
  return this.http.get(url).pipe(map(x => x));
  }
  GetBHKDetailsOnSelectedBuildingtype = (user, selectedProjectNames) => {
    const url =  `${environment.apiUrl}api/ProjectDetails/GetBuildingType/UserId,EntityId,UserType,ProjectName?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}&TenantId=${user.TenantId}&ProjectName=${selectedProjectNames}`;
  return this.http.get(url).pipe(map(x => x));
  }
  GetAllProjectName = (user) => {
    const url =  `${environment.apiUrl}api/ProjectDetails/GetAll/ProjectNames/UserId,EntityId,UserType?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}&TenantId=${user.TenantId}`;
  return this.http.get(url).pipe(map(x => x));
  }
  GetRateByProjectName = (user, selectedProjectNames) => {
    const url =`${environment.empApiUrl}api/ProjectDetails/GetRateFromProjectMaster/UserId,EntityId,UserType?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}&ProjectName=${selectedProjectNames}`;
  return this.http.get(url).pipe(map(x => x));
  }
  CheckDuplicateFlatDetails = (user, projectModel) => {
    const url =`${environment.empApiUrl}api/ProjectDetails/GetDuplicateFlat/UserId,EntityId,UserType,ProjectName,BuildingType,FlatNo?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}&ProjectName=${projectModel.ProjectName}&BuildingType=${projectModel.buildingType}&FlatNo=${projectModel.FlatNo}`;
    return this.http.get(url).pipe(map(x => x));
  }
  InsertProjectDetails = (projDetailModel, user) => {
    let data = {
      Id: user.UserId,
      UserType: user.UserType,
      entityId: user.EntityId,
      projectname: projDetailModel.ProjectName,
      buildingtype: projDetailModel.buildingType,
      floor: projDetailModel.Floor,
      layouttype: projDetailModel.LayoutType,
      bhk: projDetailModel.BHK,
      flatno: projDetailModel.FlatNo,
      reraarea: projDetailModel.ReraArea,
      rate: projDetailModel.Rate,
      carpetarea: projDetailModel.CarpetArea,
      enclosedBalcony: projDetailModel.EnclosedBalcony,
      attachedterrace: projDetailModel.AttachedTerrace,
      parkingslot: projDetailModel.ParkingSlot,
      parkingCharge: projDetailModel.ParkingCharge,
      plc: projDetailModel.PLC,
      infraCharge: projDetailModel.InfraCharge,
      floorRise: projDetailModel.FloorRise,
      monthlyMaintenance: projDetailModel.MonthlyMaintenance,
      flatView: projDetailModel.FlatView,
      bGroundFloorCarpetArea: projDetailModel.BGroundFloorCarpetArea,
      bFirstFloorCarpetArea: projDetailModel.BFirstFloorCarpetArea,
      bSecondFloorCarpetArea: projDetailModel.BSecondFloorCarpetArea,
      bBalconyCarpetArea: projDetailModel.BBalconyCarpetArea,
      bSaleableCarpetArea: projDetailModel.BSaleableCarpetArea,
      bTotalCarpetArea: projDetailModel.BTotalCarpetArea,
      remark: projDetailModel.Remark,
      plotArea_A: projDetailModel.PlotArea_A,
      plotArea_B: projDetailModel.PlotArea_B
    }     
    let url =`${environment.empApiUrl}api/ProjectDetails/InsertProjectDetailsData/UserId,EntityId,UserType?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}`;
    return this.http.post(url, data).pipe(map(x => x));
  }
  UpdateProjectDetails = (projectDetailModel, user, selectedProjectName) => {
    let data = {
      id: user.UserId,
      UserType: user.UserType,
      entityId: user.EntityId,
      projectName: selectedProjectName.ProjectName,
      buildingType: selectedProjectName.buildingType,
      floor: projectDetailModel.Floor,
      layoutType: projectDetailModel.LayoutType,
      bhk: projectDetailModel.BHK,
      flatNo: projectDetailModel.FlatNo,
      reraArea: projectDetailModel.ReraArea,
      rate: projectDetailModel.Rate,
      carpetArea: projectDetailModel.CarpetArea,
      enclosedBalcony: projectDetailModel.EnclosedBalcony,
      attachedTerrace: projectDetailModel.AttachedTerrace,
      parkingSlot: projectDetailModel.ParkingSlot,
      parkingCharge: projectDetailModel.ParkingCharge,
      plc: projectDetailModel.PLC,
      infraCharge: projectDetailModel.InfraCharge,
      floorRise: projectDetailModel.FloorRise,
      monthlyMaintenance: projectDetailModel.MonthlyMaintenance,
      flatView: projectDetailModel.FlatView,
      bGroundFloorCarpetArea: projectDetailModel.BGroundFloorCarpetArea,
      bFirstFloorCarpetArea: projectDetailModel.BFirstFloorCarpetArea,
      bSecondFloorCarpetArea: projectDetailModel.BSecondFloorCarpetArea,
      bBalconyCarpetArea: projectDetailModel.BBalconyCarpetArea,
      bSaleableCarpetArea: projectDetailModel.BSaleableCarpetArea,
      bTotalCarpetArea: projectDetailModel.BTotalCarpetArea,
      remark: projectDetailModel.Remark,
      plotArea_A: projectDetailModel.PlotArea_A,
      plotArea_B: projectDetailModel.PlotArea_B,
      available:projectDetailModel.Available,
    }     
    let url =`${environment.empApiUrl}api/ProjectDetails/UpdateProjectDetailsData/UserId,EntityId,UserType?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}`;
    return this.http.put(url, data).pipe(map(x => x));
  }

}
