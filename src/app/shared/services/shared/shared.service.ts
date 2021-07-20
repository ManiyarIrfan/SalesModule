import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { map, take } from 'rxjs/operators';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  public logoutListener = new Subject<any>();
  public changeUserListener = new Subject<any>();
  public changeOrderListener = new Subject<any>();
  public changePaymentListener = new Subject<any>();
  // public changeFinancialListener = new Subject<any>();
  public changePaymentDropdownListListener = new Subject<any>();
  public changeLead1Listener = new Subject<any>();
  public changeLeadGenerateListener = new Subject<any>();
  public changePresalesIneractionListener = new Subject<any>();
  public changeSalesInteractionListener = new Subject<any>();
  public changeallLeadSearchDetailsListener = new Subject<any>();
  public changecancelGenralSearchListener = new Subject<any>();
  public changearchitectInteractionListener = new Subject<any>();
  public closeSideMenuListner = new Subject<any>();
  public sharedSelectedMenuListner = new Subject<string>();
  public loggedInuserDetails: any;

  // community Shared 
  public setDiscussionData = new Subject<any>();
  public getDiscussionData = new Subject<any>();
  public backtoHome = new Subject<any>();
  public shareTabName = new Subject<any>();
  public sharePostData = new Subject<any>();

  constructor(private http: HttpClient) { }

  public shareLogoutActivity() {
    this.logoutListener.next();
  }
  GetSideBarMenus = () => {
    const url = '../../../../assets/sideMenu.json';
    return this.http.get(url).pipe(map(x => x));
  }
  public shareSelectedUser(user) {
    this.changeUserListener.next(user);
  }
  public shareOrderDetails(Order) {
    this.changeOrderListener.next(Order);
  }
  public sharePaymentDetails(payment) {
    this.changePaymentListener.next(payment);
  }
  public shareFinancialDetails(paymentDropdown) {
    // this.changeFinancialListener.next(financial);
    this.changePaymentDropdownListListener.next(paymentDropdown);
  }
  public shareLeadDetails(tabID) {
    this.changeLead1Listener.next(tabID);
  }
  public shareLeadDetailsToGenerate(tabID) {
    this.changeLeadGenerateListener.next(tabID);
  }
  public sharePresalesIneractionDetails(details) {
    this.changePresalesIneractionListener.next(details);
  }
  public changeSalesIneractionDetails() {
    this.changeSalesInteractionListener.next();
  }
  public allLeadSearchDetails(selectedDetails) {
    this.changeallLeadSearchDetailsListener.next(selectedDetails);
  }
  public cancelGenralSearch() {
    this.changecancelGenralSearchListener.next();
  }
  public architectInteraction(archDetails) {
    this.changearchitectInteractionListener.next(archDetails);
  }
  public closeMenu(data) {
    this.closeSideMenuListner.next(data);
  }

  // community Shared service
  public setDiscussions(data) {
    this.setDiscussionData.next(data);
  }
  public getDiscussions(Alldata) {
    this.getDiscussionData.next({ Action: Alldata.Action, data: Alldata.data, });
  }
  public goToHome(value) {
    this.backtoHome.next(value);
  }

  public shareTab(item) {
    this.shareTabName.next(item);
  }
  public sharePost(item) {
    this.sharePostData.next(item);
  }
  public shareMenuItem(item) {
    this.sharedSelectedMenuListner.next(item);
  }

  public search(user, term: string) {
    const url = `${environment.empApiUrl}SearchCustomer/UserId,UserType,EntityId?TenantId=${user.TenantId}&SearchInput=${term}`;
    return this.http.get(url).pipe(map(x => x));
  }
  searchEnqLead(user, term: string): Observable<any[]> {
    const url = `${environment.empApiUrl}api/PresalesDashboard/SearchEnquiryForFrontDeskOrAdmin/UserId,EntityId,UserType,Search?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}&TenantId=${user.TenantId}&Search=` + term;
    var ClientList = this.http.get(url).pipe(map((r) => {
      return (r[0].length != 0 ? this.prepareArray(r[0].data) : [{ "CustId": 0, "CustName": "No Record Found" }]) as any[]
    }));
    return ClientList;
  }
  prepareArray = (data) => {
    let cmbinedarr = [];
    if (data) {
      const enquiryArray = data[0].map((ele) => {
        return {
          "Name": ele['FirstName'] + '' + ele['LastName'],
          "MobileNo": ele['MobileNo'],
          "UserId": ele['EnquiryId'],
          "Email": ele['Email'],
          "UserType": ele["UserType"]
        }
      });
      const referralArray = data[1].map((ele) => {
        return {
          "Name": ele['Name'],
          "MobileNo": ele['MobileNo'],
          "UserId": ele['ReferralId'],
          "Email": ele['Email'],
          "UserType": ele['UserType']
        }
      });
      cmbinedarr = enquiryArray.concat(referralArray);
    }
    return cmbinedarr;
  }
  extendSession = () => {
    const url = environment.apiUrl + 'ReissueToken/UserId';
    return this.http.get(url).pipe(map(x => x));
  }
  getEmployeeFirstLoginTime = (user) => {
    const url = `${environment.empApiUrl}api/EmployeeDashboard/GetEmployeeTodaysLogin/UserId,EntityId,UserType?UserId=${user.UserId}&UserType=${user.UserType}&EntityId=${user.EntityId}`;
    return this.http.get(url).pipe(map(x => x));
  }
  // GetAllEmployeesRoles = () => {
  //   const url = `${environment['empApiUrl']}api/GetAllEmployeeRoles`;
  //   return this.http.get(url).pipe(map(x => x));
  // }
  switchRole = (user, switchRole) => {
    let data = {
      id: user.UserId,
      userType: user.UserType,
      entityId: user.EntityId,
      role: switchRole.Role ? Number(switchRole.Role) : null,
      reason: switchRole.Reason ? switchRole.Reason : null
    }
    let url = `${environment.empApiUrl}api/EmployeeAdmin/InsertSwitchRoleRequest/UserId,EntityId,UserType?UserId=${user.UserId}&UserType=${user.UserType}&EntityId=${user.EntityId}`;
    return this.http.post(url, data).pipe(map(x => x), take(1));
  }
  getFileDetailServices = (user, type) => {
    const url = environment.marketingApiUrl + `api/Master/DocumentMaster_SearchAndSelect/UserId,EntityId,UserType?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}&Input=${'SearchByStakeholder'}&DocType=${type}&StakeholderType=${user.UserType}`;
    return this.http.get(url).pipe(map(x => x));
  }
}
