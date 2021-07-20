import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AdminPanelService {

  constructor(private http: HttpClient) { }

  GetAllEmployeesNamesOnSelected = () => {
    const url = `${environment.empApiUrl}api/GetAllEmployeeNames`;
    return this.http.get(url).pipe(map(x => x));
  }
  GetAllEmployeesRolesOnSelected = () => {
    const url = `${environment.empApiUrl}api/GetAllEmployeeRoles`;
    return this.http.get(url).pipe(map(x => x));
  }
  GetProjectListOnSelected = (user) => {
    const url = `${environment.apiUrl}api/ProjectDetails/GetAll/ProjectNames/UserId,EntityId,UserType?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}`;
    return this.http.get(url).pipe(map(x => x));
  }
  GetLocationOnSelected = (user) => {
    const url = `${environment.apiUrl}api/ProjectDetails/GetLocations/UserId,EntityId,UserType?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}`;
    return this.http.get(url).pipe(map(x => x));
  }
  getMobileValidation = (mobile) => {
    const url = `${environment.apiUrl}/api/IsDuplicate/mobileNo?MobileNo=${mobile}`;
    return this.http.get(url).pipe(map(x => x));
  }
  getEmailValidation = (email) => {
    const url = `${environment.apiUrl}/api/IsDuplicate/emailId?EmailId=${email}`;
    return this.http.get(url).pipe(map(x => x));
  }
  GetAllFlag = () => {
    const url = `${environment.empApiUrl}api/GetAllUtilityFlagStatus`;
    return this.http.get(url).pipe(map(x => x));
  }
  getAllSalesEmployeeOnSelected = (Role) => {
    const url = `${environment.empApiUrl}api/GetAllEmployeeNames_ByRole?Role=${Role}`;
    return this.http.get(url).pipe(map(x => x));
  }
  InsertEmployee = (user, adminPanelModel) => {

    let data = {
      Id: user.UserId,
      firstname: adminPanelModel.FirstName,
      lastname: adminPanelModel.LastName,
      mobileno: adminPanelModel.MobileNo,
      email: adminPanelModel.Email,
      role: adminPanelModel.Role,
      assingedarea: adminPanelModel.AssingedArea,
      assingedproject1: adminPanelModel.AssingedProject1,
      assingedproject2: adminPanelModel.AssingedProject2,
      assingedproject3: adminPanelModel.AssingedProject3,
      reportingto: adminPanelModel.ReportingTo,
      level: adminPanelModel.Level,
      assingedcity: adminPanelModel.City,
      WeeklyOff: adminPanelModel.woff,
      noLeadsDay: adminPanelModel.wdays,
      switchRole: (adminPanelModel.registration && adminPanelModel.registration === true) ? null : adminPanelModel.SwitchRole,
      engagementType: adminPanelModel.EngagementType,
      tenantId: user.TenantId,
      registration: adminPanelModel.registration,
      modulename: adminPanelModel.ModuleName
    }
    let url = `${environment.empApiUrl}api/EmployeeAdmin/EmployeeRegistration/UserId,EntityId,UserType?UserId=${user.UserId}&EntityId=${user.EntityId}&DeviceDetails=${user.DeviceDetails}`;
    return this.http.post(url, data).pipe(map(x => x), take(1));
  }
  UpdateEmployee = (user, adminPanelModel, ID) => {
    let data = {
      EmployeeId: ID ? ID : null,
      UserType: user.UserType ? user.UserType : null,
      FirstName: adminPanelModel.FirstName ? adminPanelModel.FirstName : null,
      LastName: adminPanelModel.LastName ? adminPanelModel.LastName : null,
      MobileNo: adminPanelModel.MobileNo ? adminPanelModel.MobileNo : null,
      Email: adminPanelModel.Email ? adminPanelModel.Email : null,
      Role: adminPanelModel.Role ? adminPanelModel.Role : null,
      AssingedArea: adminPanelModel.AssingedArea ? adminPanelModel.AssingedArea : null,
      AssingedProject1: adminPanelModel.AssingedProject1 ? adminPanelModel.AssingedProject1 : null,
      AssingedProject2: adminPanelModel.AssingedProject2 ? adminPanelModel.AssingedProject2 : null,
      AssingedProject3: adminPanelModel.AssingedProject3 ? adminPanelModel.AssingedProject3 : null,
      ReportingTo: adminPanelModel.ReportingTo ? adminPanelModel.ReportingTo : null,
      Level: adminPanelModel.Level ? adminPanelModel.Level : null,
      AssingedCity: adminPanelModel.City ? adminPanelModel.City : null,
      WeeklyOff: adminPanelModel.wdays ? adminPanelModel.wdays : null,
      Id:user.UserId ? user.UserId : null,
      NoLeadsDay: adminPanelModel.wdays ? adminPanelModel.wdays : null,
      SwitchRole: adminPanelModel.SwitchRole ? adminPanelModel.SwitchRole : null,
      EngagementType: adminPanelModel.EngagementType ? adminPanelModel.EngagementType : null,
      UMID: adminPanelModel.UMID ? adminPanelModel.UMID : null,
      ModuleName: adminPanelModel.ModuleName ? adminPanelModel.ModuleName : null,
      TenantId: user.TenantId ? user.TenantId: null
    }
    let url = `${environment.empApiUrl}api/EmployeeAdmin/EmployeeUpdate/UserId,EntityId,UserType?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}&TenantId=${user.TenantId}`;
    return this.http.put(url, data).pipe(map(x => x), take(1));
  }
  getEmployeeList = (user) => {
    const url = `${environment.empApiUrl}api/EmployeeAdmin/GetEmployeeList/UserId,EntityId,UserType?UserType=${user.UserType}`;
    return this.http.get(url).pipe(map(x => x));
  }
  getAllLogList = (user) => {
    const url = `${environment.empApiUrl}api/EmployeeAdmin/GetTempExcelData/UserId,EntityId,UserType?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}`;
    return this.http.get(url).pipe(map(x => x));
  }
  getAllCPlistForApproval = (user) => {
    const url = `${environment.empApiUrl}api/EmployeeAdmin/GetChannelPartnerList/UserId,EntityId,UserType?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}`;
    return this.http.get(url).pipe(map(x => x));
  }
  getAllUsers = (user) => {
    const url = `${environment.apiUrl}api/PendingPANVerifications/UserId,EntityId,UserType?UserId=${user.UserId}&UserType=${user.UserType}&TenantId=${user.TenantId}`;
    return this.http.get(url).pipe(map(x => x));
  }
  updateCpStatus = (user, cpModel) => {
    let data =
    {
      entityId: cpModel,
      id: user.UserId
    }
    let url = `${environment.empApiUrl}api/EmployeeAdmin/ApproveChannelPartner/UserId,EntityId,UserType?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}`;
    return this.http.put(url, data).pipe(map(x => x), take(1));
  }
  updatePanStatus = (user, stordata) => {
    let data =
    {
      AccId: stordata.AccId ? stordata.AccId : null,
      AccType: stordata.AccType ? stordata.AccType : null,
      newStatus: stordata.PanStatus ? stordata.PanStatus : null,
      userId: user.UserId
    }
    let url = `${environment.apiUrl}api/PANVerificationUpdate/UserId,EntityId,UserType?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}`;
    return this.http.post(url, data).pipe(map(x => x), take(1));
  }
  varifyPandetails = (user, Pandata) => {
    let data =
    {
      panNumber: Pandata.PanNo ? Pandata.PanNo : null,
      fullName: Pandata.FullName ? Pandata.FullName : null,
      dateOfBirth: Pandata.DateOfBirth ? Pandata.DateOfBirth : null,
      status: Pandata.PANType ? Pandata.PANType : null,
    }
    let url = `${environment.apiUrl}api/VerifyPAN/UserId,EntityId,UserType,VerifyPANModel?UserId=${user.UserId}&UserType=${user.UserType}`;
    return this.http.post(url, data).pipe(map(x => x), take(1));
  }
  declineCpStatus = (user, cpModel) => {
    const url = `${environment.empApiUrl}api/EmployeeAdmin/DeclineChannelPartner/UserId,EntityId,UserType?UserId=${user.UserId}&EntityId=${cpModel}&UserType=${user.UserType}&Id=${user.UserId}`;
    return this.http.delete(url).pipe(map(x => x));
  }
  utilityFlag = (user, flag, flagName) => {
    let data =
    {
      key: flagName,
      value: flag
    }
    let url = `${environment.empApiUrl}api/UpdateUtilityFlag?Key=${flagName}&Value=${flag}`;
    return this.http.put(url, data).pipe(map(x => x), take(1));
  }
  getAllOrgnisation = (user) => {
    const url = `${environment.empApiUrl}/api/GetAllOrganization/UserId,EntityId,UserType?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}`;
    return this.http.get(url).pipe(map(x => x));
  }
  getAllProjectNames = (user) => {
    const url = `${environment.apiUrl}api/ProjectDetails/GetAll/ProjectNames/UserId,EntityId,UserType?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}`;
    return this.http.get(url).pipe(map(x => x));
  }
  projectAssignToOrganisation = (user, cpAdminPanelModel) => {
    let data = {
      oraganizationId: cpAdminPanelModel.Organisation,
      brokerId: cpAdminPanelModel.BrokerId,
      projectId: cpAdminPanelModel.ProjectName,
      id: user.UserId
    }
    let url = `${environment.empApiUrl}api/EmployeeAdmin/AssignProjectToOrganization/UserId,EntityId,UserType?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}`;
    return this.http.put(url, data).pipe(map(x => x), take(1));
  }
  importExcel = (user, importLeadExcel, importModel) => {
    let data = {
      leadExcelModel: {
        entityId: user.EntityId,
        userType: user.UserType,
        assignedto: importModel.empIds,
        id: user.UserId,
        typeOfUser: importModel.TypeOfUser,
        source: importModel.Source,
        campaign: importModel.Campaign
      },
      files: importLeadExcel
    }
    const url = `${environment.empApiUrl}api/EmployeeAdmin/ImporLeadExcelData/UserId,EntityId,UserType?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}`;
    return this.http.post(url, data).pipe(map(x => x), take(1));
  }

  importMigrationExcel = (user, importLeadExcel) => {
    let data = {
      leadExcelModelMigration: {
        entityId: user.EntityId,
        userType: user.UserType,
        id: user.UserId
      },
      files: importLeadExcel
    }
    const url = `${environment.empApiUrl}api/EmployeeAdmin/ImporLeadExcelDataMigration/UserId,EntityId,UserType?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}`;
    return this.http.post(url, data).pipe(map(x => x), take(1));
  }

  insertSourceCampaign = (user, sourcecampaignmodel) => {
    let data = {
      name: sourcecampaignmodel.Name,
      type: sourcecampaignmodel.Type,
      id: user.UserId,
      campaignNo: sourcecampaignmodel.campaignNo
    }
    const url = `${environment.empApiUrl}api/EmployeeAdmin/InsertCampaignSource/UserId,EntityId,UserType?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}`;
    return this.http.post(url, data).pipe(map(x => x), take(1));
  }
  getSourceCampaign = (user, Type) => {
    const url = `${environment.empApiUrl}api/EmployeeAdmin/GetSourceCampaign/UserId,EntityId,UserType,Type?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}&Type=${Type ? Type : ''}`;
    return this.http.get(url).pipe(map(x => x));
  }
  public jwt() {
    if (localStorage.getItem('LoggedinUser') && JSON.parse(localStorage.getItem('LoggedinUser'))) {
      return {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': "Bearer " + JSON.parse(localStorage.getItem('LoggedinUser')).token
        })
      }
    }
  }
  getAuditTable = (user, fromDate, toDate, Input) => {
    const url = `${environment.empApiUrl}api/EmployeeAdmin/GetAuditList/UserId,EntityId,UserType,FromDate,ToDate,Input?UserType=${user.UserType}&FromDate=${fromDate}&ToDate=${toDate}&Input=${Input}`;
    return this.http.get(url).pipe(map(x => x));
  }
}
