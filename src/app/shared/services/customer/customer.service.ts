import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map, take } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  constructor(private http: HttpClient) { }
  GetCustomerDetails = (user) => {
    const url = `${environment.apiUrl}api/Customer/GetCustomerInfo/UserId,EntityId,UserType?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}`;
    return this.http.get(url).pipe(map(x => x));
  }
  GetPreferredLocation = (user) => {
    const url = `${environment.apiUrl}api/ProjectDetails/GetLocations/UserId,EntityId,UserType?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}&TenantId=${user.TenantId}`;
    return this.http.get(url).pipe(map(x => x));
  }
  GetProjectListOnSelectedLocation = (user, selectedLocation) => {
    const url = `${environment.apiUrl}api/ProjectDetails/GetProjectNames/UserId,EntityId,UserType,location?TenantId=${user.TenantId}&location=${selectedLocation}`;
    return this.http.get(url).pipe(map(x => x));
  }
  GetBHKDetailsOnSelectedProject = (user, selectedProject) => {
    const url = `${environment.apiUrl}api/ProjectDetails/GetBHK/UserId,EntityId,UserType,ProjectName?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}&TenantId=${user.TenantId}&ProjectName=${selectedProject}`;
    return this.http.get(url).pipe(map(x => x));
  }
  GetSerarchedProjectDetails = (user, selectedFilter) => {
    const url = `${environment.apiUrl}api/ProjectDetails/GetProjectDetail/UserId,EntityId,UserType,Location,ProjectName,BHK?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}&TenantId=${user.TenantId}&location=${selectedFilter.preferredLocation}&ProjectName=${selectedFilter.preferredProjects}&BHK=${selectedFilter.preferredBHK}`;
    return this.http.get(url).pipe(map(x => x));
  }

  UpdateCustomerDetails = (custModel, user) => {
    let data = {
      Id: user.UserId,
      userType: user.UserType,
      EntityId: user.EntityId,
      addressLine1: custModel.AddressLine1 ? custModel.AddressLine1 : null,
      city: custModel.City ? custModel.City : null,
      state: custModel.State ? custModel.State : null,
      country: custModel.Country ? custModel.Country : null,
      pincode: custModel.Pincode ? custModel.Pincode : null,
      alternateNo: custModel.AlternateNo ? custModel.AlternateNo : null,
      occupation: custModel.Occupation ? custModel.Occupation : null,
      dob: custModel.Dob ? custModel.Dob : null,
      upiCode: custModel.UPICode ? custModel.UPICode : null,
      truPayAccountNo: custModel.AccountNo ? custModel.AccountNo : null,
      truPayBankName: custModel.BankName ? custModel.BankName : null,
      truPayBankBranch: custModel.BankBranch ? custModel.BankBranch : null,
      truPayIFSCCode: custModel.IFSCCode ? custModel.IFSCCode : null
    }
    let url = `${environment.apiUrl}api/Customer/UpdateCustomer/UserId,EntityId,UserType?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}`;
    return this.http.put(url, data).pipe(map(x => x), take(1));
  }
  fetchPaymentLink = (user, InvoiceNumber) => {
    const url = `${environment.empApiUrl}api/TRUPay/RazorpayFetchPaymentLink/UserId,EntityId,UserType?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}&TenantId=${user.TenantId}&InvoiceNumber=${InvoiceNumber}`;
    return this.http.get(url).pipe(map(x => x));
  }
  addVirtualPayment = (user, transactionDetails, input) => {
    let data = {
      entityId: user.EntityId ? user.EntityId : null,
      userType: user.UserType ? user.UserType : null,
      transactionId: transactionDetails.TransactionId ? transactionDetails.TransactionId : null,
      transactionType: transactionDetails.TransactionType ? transactionDetails.TransactionType : null,
      amount: transactionDetails.amount ? transactionDetails.amount : null,
      tenantId: user.TenantId,
      id: user.UserId,
      input
    }
    let url = `${environment.empApiUrl}api/TRUPay/InsertVirtualWallet?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}`;
    return this.http.post(url, data).pipe(map(x => x), take(1));
  }
}
