import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PowerSalesDashboardService {

  constructor(private http: HttpClient) { }

  getCpLeadDetails = (user, leadId) => {
    const url = `${environment.empApiUrl}api/PowerSalesDashboard/GetChannelPartnerLeadDetails/UserId,EntityId,UserType,BrokerId?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}&TenantId=${user.TenantId}&BrokerId=${leadId}`;
    return this.http.get(url).pipe(map(x => x));
  }
  Get_Count = (user) => {
    const url =`${environment.empApiUrl}api/PowerSalesDashboard/CountTotal/UserId,EntityId,UserType?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}&TenantId=${user.TenantId}`;
    return this.http.get(url).pipe(map(x => x));
  }
  DetailsForModal = (user, status) => {
    const url =  `${environment.empApiUrl}api/PowerSalesDashboard/PowersalesDetailsForModal/UserId,EntityId,UserType,TileName?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}&TenantId=${user.TenantId}&TileName=${status}`;
    return this.http.get(url).pipe(map(x => x));
  }
  cpSiteScheduleTile = (user) => {
    const url = `${environment.channelApiUrl}api/ChannelPartnersReport/GetCPLeadAnalysis/UserId,EntityId,UserType?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}&Role=${user.Role === 20 ? user.Role : null}`;
    return this.http.get(url).pipe(map(x => x));
  }
 
}
