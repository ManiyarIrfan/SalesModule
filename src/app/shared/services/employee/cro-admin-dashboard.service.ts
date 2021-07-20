import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CroAdminDashboardService {

  constructor(private http: HttpClient) { }
  getCROLeadsDataReport = (user) => {
    const url = `${environment.empApiUrl}api/CROAdminDashboard/GetCROLeadsDataReport/UserId,EntityId,UserType?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}`
    return this.http.get(url).pipe(map(x => x));
  }
  GetCROLeadsByCROId = (user, CROId) => {
    const url = `${environment.empApiUrl}api/CROAdminDashboard/GetCROLeadsByCROId/UserId,EntityId,UserType,CROId?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}&CROId=${CROId}`
    return this.http.get(url).pipe(map(x => x));
  }
  GetReferralByReferralId = (user, ReferralModel) => {
    const url = `${environment.empApiUrl}api/LeadDashboard/GetLeadById/UserId,EntityId,UserType,ReferralId?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}&ReferralId=${ReferralModel.ReferralId}`
    return this.http.get(url).pipe(map(x => x));
  }
  getAllSalesEmployeeOnSelected = (user,Role) => {
    const url = `${environment.empApiUrl}api/GetAllEmployeeNames_ByRole?Role=${Role}&TenantId=${user.TenantId}`;
    return this.http.get(url).pipe(map(x => x));
  }
  UpdateLeadSalesPerson = (refModel, user) => {
    let data = {
      Details: refModel.details,
      EntityId: refModel.ReferralId ? refModel.ReferralId : '',
      UserType: refModel.UserType,
      CreatorUserType: user.UserType,
      Id: user.UserId,
      InteractionType: refModel.InteractionType,
      CreatorId: user.EntityId,
    }   
    let url =  `${environment.empApiUrl}api/Interaction/Insert/UserId,EntityId,UserType?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}&TenantId=${user.TenantId}`;
    return this.http.post(url, data).pipe(map(x => x, take(1)));
  }
  UpdateReferralStatus = (refModel, user) => {
    let data = {
      ReferralId: refModel.ReferralId ? refModel.ReferralId : '',
      SalesAgentAssinged: refModel.SalesAgentAssignedId ? refModel.SalesAgentAssignedId : '',
      ReferralStatus: refModel.ReferralStatus ? refModel.ReferralStatus : '',
      UserType: refModel.UserType,
      Id: user.UserId,
      EntityId: user.EntityId,
    }   
    let url =  `${environment.empApiUrl}api/LeadDashboard/Update/UserId,EntityId,UserType?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}&TenantId=${user.TenantId}`;
    return this.http.put(url, data).pipe(map(x => x, take(1)));
  }
  
 
}
