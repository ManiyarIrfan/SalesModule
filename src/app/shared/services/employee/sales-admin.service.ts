import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SalesAdminService {

  constructor(private http: HttpClient) { }
  updateUserId = (user, Model) => {
    let data = {
      id: Model.Id ? Model.Id : null,
      oldUserId: Model.OldUserId ? Model.OldUserId : null,
      newUserId: Model.NewUserId ? Model.NewUserId : null,
      updatedBy: user.UserId ? user.UserId : null
    }
    let url = `${environment.apiUrl}api/ChangeUserIdByEmployee?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}&DeviceDetails=${user.DeviceDetails}`;
    return this.http.post(url, data).pipe(map(x => x), take(1));
  }
  sendPassword = (user, Id) => {
    const url = `${environment.apiUrl}api/PassWordEmailSend?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}&Id=${Id}&DeviceDetails=${user.DeviceDetails}`
    return this.http.get(url).pipe(map(x => x));
  }
  getAllUsers = (user, usertype) => {
    const url = `${environment.apiUrl}api/GetStackholderDetailsByUserType?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${usertype.Stakeholder}&TenantId=${user.TenantId}`
    return this.http.get(url).pipe(map(x => x));
  }
  ChannelPartnerReferral = (user) => {
    const url = `${environment.channelApiUrl}api/ChannelPartners/MyChannelPartnerReferral/UserId,EntityId,UserType?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}`;
    return this.http.get(url).pipe(map(x => x));
  }
  CPInvoiceData = (user, input) => {
    let data = {
      input,
      entityId: user.EntityId ? user.EntityId : null,
      userType: user.UserType ? user.UserType : null,
      tenantId: user.TenantId ? user.TenantId : null,
      id: user.UserId ? user.UserId : null,
      customerName: null,
      projectName: null,
      buildingType: null,
      bookingDateFrom: null,
      bookingDateTo: null,
      brokerId: null,
      salesAgentId: null,
    }
    let url = `${environment.empApiUrl}api/CustomerOrder/GetOrders/UserId,EntityId,UserType?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}}&TenantId=${user.TenantId}`;
    return this.http.post(url, data).pipe(map(x => x), take(1));
  }
  ApproveRajectReferral = (user, details, remark) => {
    let data = {
      id: user.UserId ? user.UserId : null,
      mobileNo: details.MobileNo ? details.MobileNo : null,
      email: details.Email ? details.Email : null,
      verificationStatus: details.NewStatus ? details.NewStatus : null,
      verificationReason: remark ? remark : null
    }
    let url = `${environment.channelApiUrl}api/ChannelPartners/UpdateCPRVerification/UserId,EntityId,UserType?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}`;
    return this.http.put(url, data).pipe(map(x => x), take(1));
  }
  ApproveRajectInvoice = (user, details, remark) => {
    let data = {
      orderId: details.OrderId ? details.OrderId : null,
      verificationStatus: details.NewStatus ? details.NewStatus : null,
      verificationReason: remark ? remark : null
    }
    let url = `${environment.empApiUrl}api/CustomerOrder/UpdateCPOrderVerification/UserId,EntityId,UserType?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}`;
    return this.http.put(url, data).pipe(map(x => x), take(1));
  }
  insertintoGeneralVoucher = (user, cpDetails) => {
    const data = {
      userId: user.UserId,
      entityType: cpDetails.EntityType ? cpDetails.EntityType : null,
      truPayVirtualId: cpDetails.TRUPayVirtualId ? cpDetails.TRUPayVirtualId : null,
      withoutTaxAmount: cpDetails.Amount ? cpDetails.Amount : null,
      panNumber: cpDetails.PanNumber ? cpDetails.PanNumber : null,
      entityId: cpDetails.BrokerId ? cpDetails.BrokerId : null,
      module: cpDetails.VoucherType ? cpDetails.VoucherType : null,
      cpFullName: cpDetails.Name ? cpDetails.Name : null
    }
    const url = `${environment.empApiUrl}api/TRUPay/AcountingCPAmountInsert/UserId,EntityId,UserType`;
    return this.http.post(url, data).pipe(map(x => x), take(1));
  }

  DisqualifiedleadEOI = (user) => {
    const url = `${environment.apiUrl}api/Customer/GetDisqualifiedCustomers/UserId,EntityId,UserType?UserId=${user.UserId}`
    return this.http.get(url).pipe(map(x => x));
  }

  insertEoireturn = (user, leadDetails) => {
    const data = {
      referralId: leadDetails.ReferralId ? leadDetails.ReferralId : null,
      id: user.UserId,
    }
    const url = `${environment.apiUrl}api/Customer/CustomerApproveEOIReturn/UserId`;
    return this.http.put(url, data).pipe(map(x => x), take(1));
  }

  getInfoByreferralId = (user, referralId) => {
    const url = `${environment.empApiUrl}api/LeadDashboard/GetLeadById/UserId,EntityId,UserType,ReferralId?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}&ReferralId=${referralId}`;
    return this.http.get(url).pipe(map(x => x));
  }

  allCpNames = (user) => {
    const url = `${environment.channelApiUrl}api/ChannelPartners/GetAll/UserId,EntityId,UserType?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}`;
    return this.http.get(url).pipe(map(x => x));
  }
  allCRONames = (user, type) => {
    const url = `${environment.channelApiUrl}api/CRO/CROOrChannelPartnerSearch/UserId,EntityId,UserType,Search?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${type}`;
    return this.http.get(url).pipe(map(x => x));
  }

  referedChangeRequest = (user, Refmodel, input) => {
    const data = {
      leadId: Refmodel.TReferralId ? Refmodel.TReferralId : null,
      oldReferralId: Refmodel.ReferredById ? Refmodel.ReferredById : null,
      remark: Refmodel.Remark ? Refmodel.Remark : null,
      oldReferralType: Refmodel.ReferredByType ? Refmodel.ReferredByType : null,
      newReferralId: Refmodel.newReferral ? Refmodel.newReferral : null,
      newReferralType: Refmodel.ReferredType ? Refmodel.ReferredType : null,
      status: Refmodel.Status ? Refmodel.Status : null,
      rId: Refmodel.Rid ? Refmodel.Rid : null,
      id: user.UserId,
      tenantId: Refmodel.TenantId ? Refmodel.TenantId : null,
      input
    }
    const url = `${environment.apiUrl}api/Referral/ChangeReferredByRequest/UserId,UserType?UserId=${user.UserId}&TenantId=${user.TenantId}&DeviceDetails=${user.DeviceDetails}`;
    return this.http.post(url, data).pipe(map(x => x), take(1));
  }
  getreferChangeRequest = (user) => {
    const url = `${environment.apiUrl}api/Referral/GetChangeReferredByRequest/UserId,EntityId,UserType?UserId=${user.UserId}&UserType=${user.UserType}&TenantId=${user.TenantId}`;
    return this.http.get(url).pipe(map(x => x));
  }
  getAllSalesEmployeeOnSelected = (user, Role) => {
    const url = `${environment.empApiUrl}api/GetAllEmployeeNames_ByRole?TenantId=${user.TenantId}&Role=${Role}`;
    return this.http.get(url).pipe(map(x => x));
  }
}
