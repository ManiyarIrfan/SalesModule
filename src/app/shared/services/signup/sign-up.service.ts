import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map, take } from 'rxjs/operators';
import { IRegistrationModel } from '../../models/Authentication/signup.model';

@Injectable({
  providedIn: 'root'
})
export class SignUpService {

  constructor(private http: HttpClient) { }

  getAllOrgnisation = () => {
    const url = `${environment.empApiUrl}/api/GetAllOrganization/UserId,EntityId,UserType`;
    return this.http.get(url).pipe(map(x => x));
  }

  getMobileValidation = (mobile) => {
    const url = `${environment.apiUrl}api/IsDuplicate/mobileNo?MobileNo=${mobile}`;
    return this.http.get(url).pipe(map(x => x));
  }

  getEmailValidation = (email) => {
    const url = `${environment.apiUrl}api/IsDuplicate/emailId?EmailId=${email}`;
    return this.http.get(url).pipe(map(x => x));
  }

  getOtp = (mobileNo) => {
    const url = `${environment.apiUrl}GetOtp/mobileNo?mobileNo=${mobileNo}`;
    return this.http.get(url).pipe(map(x => x));
  }

  insertEnquiry(InsertModel) {
    let data = {
      FirstName: InsertModel.name,
      Email: InsertModel.EmailId,
      MobileNo: InsertModel.mobileNo,
      Source: InsertModel.Source,
      TenantId: InsertModel.TenantId
    }
    let url = `${environment.empApiUrl}api/PresalesDashboard/InsertEnquiryFromWeb/UserId,EntityId,UserType`;
    return this.http.post(url, data).pipe(map(x => x), take(1));
  }

  verifyOtp = (sessionID, OTP) => {
    const url = `${environment.apiUrl}VarifyOtp/mobileNo/OTP?sessionID=${sessionID}&OTP=${OTP}`;
    return this.http.get(url).pipe(map(x => x));
  }

  cpReferralApprovedCheck = (mobileNo) => {
    const url = `${environment.channelApiUrl}api/Common/CPReferralApproval/MobileNo?MobileNo=${mobileNo}`;
    return this.http.get(url).pipe(map(x => x));
  }

  insertRegisterDetails = (registerModel, uploadFileListAdharCard, uploadFilePanCard,deviceDetails) => {
   
    let data = {
      userRegistration: {
        userType: registerModel.userType,  
        flag: registerModel.isOwnedFlat,
        FirstName: registerModel.fname,
        middleName: registerModel.mname,
        LastName: registerModel.lname,
        mobileNo: registerModel.MobileNo,
        Pwd: registerModel.Pwd,
        Dob: registerModel.dob,
        email: registerModel.Email,
        addressLine1: registerModel.AddressLine1,
        city: registerModel.City,
        preferredCity: registerModel.PreferredCity,
        preferredLocation: registerModel.PreferredLocation,
        budget: registerModel.Budget,
        reraNo: registerModel.ReraNo,
        organization: registerModel.Organization,
        panNo: registerModel.PanNo,
        aadharNo: registerModel.AadharNo,
        type: registerModel.Type,
        gstin: registerModel.GSTIN,
        referredBy: registerModel.referredCpname ? registerModel.referredCpname : null,
        panVerificationStatus: 'Pending',
        panType: registerModel.PancardType ? registerModel.PancardType : null
      },
      Adhar: uploadFileListAdharCard,
      Pan: uploadFilePanCard,
    }
    let url = `${environment.apiUrl}api/UserRegistration?devicedetails=${deviceDetails}`;
    return this.http.post(url, data).pipe(map(x => x), take(1));
  }
  getPanValidation = (panNo) => {
    const url = `${environment.apiUrl}api/IsDuplicate/emailId?Input=${'PANVarification'}&PanNumber=${panNo}`;
    return this.http.get(url).pipe(map(x => x));
  }
  registerPhasetwoEmployee = (registerModel, profileArray) => {
    let data = {
      registationModel: {
        userType: registerModel.userType,
        userId: registerModel.userId ? registerModel.userId : null,
        supplierId: registerModel.supplierId ? registerModel.supplierId : null,
        addressId: registerModel.addressId ? registerModel.addressId : null,
        firstName: registerModel.fname ? registerModel.fname : null,
        MiddleName: registerModel.mname ? registerModel.mname : null,
        lastName: registerModel.lname ? registerModel.lname : null,
        serviceProvider: registerModel.Serviceprovider ? registerModel.Serviceprovider : null,
        officeNo: registerModel.OfficeNo ? registerModel.OfficeNo : null,
        mobileNo: registerModel.MobileNo ? registerModel.MobileNo : null,
        streetAddress1: registerModel.AddressLine1 ? registerModel.AddressLine1 : null,
        country: registerModel.Country ? registerModel.Country : null,
        state: registerModel.State ? registerModel.State : null,
        city: registerModel.City ? registerModel.City : null,
        pin: registerModel.Pin ? registerModel.Pin : null,
        email: registerModel.Email ? registerModel.Email : null,
        gstin: registerModel.supplierGSTIN ? registerModel.supplierGSTIN : null,
        pwd: registerModel.Pwd ? registerModel.Pwd : null,
        expertIn: registerModel.expertIn ? registerModel.expertIn : null,
        maxWorkField: registerModel.maxWorkField ? registerModel.maxWorkField : null,
        panNo: registerModel.PanNo ? registerModel.PanNo : null,
        aadharNo: registerModel.AadharNo ? registerModel.AadharNo : null,
        organization: registerModel.Organization ? registerModel.Organization : null,
        Turnover: registerModel.Turnover ? registerModel.Turnover : null,
        input: registerModel.Action,
        vendorType: registerModel.VendorType ? registerModel.VendorType : null,
        panType: registerModel.PancardType ? registerModel.PancardType : null,
        panVerificationStatus: 'Pending'
      },
      document: profileArray
    }
    let url = `${environment.executionApiUrl}api/Common/RegistationInsertUpdate`;
    return this.http.post(url, data).pipe(map(x => x), take(1));
  }

  logoutDetails = (user, Input) => {
    let data = {
      id: user.UserId,
      userType: user.UserType,
      entityId: user.EntityId,
      input: Input,
    }
    let url = `${environment.apiUrl}api/InsertUpdateLogInLogOutDetails`;
    return this.http.post(url, data).pipe(map(x => x), take(1));
  }

  getVendorTypes = () => {
    const url = `${environment.executionApiUrl}api/Common/GetAllVendorTypeMaster`;
    return this.http.get(url).pipe(map(x => x));
  }

  // Registration for Webinar
  registrationforWebinar = (ModelData: IRegistrationModel) => {
    const url = `${environment.marketingApiUrl}api/RegistrationforWebinar`;
    return this.http.post(url, ModelData).pipe(map(x => x), take(1));
  }

  // verify email/mobile no if already registered
  getValidation = (ModelData) => {
    let data = {
      Input: ModelData.Input ? ModelData.Input : null,
      Type: ModelData.Type ? ModelData.Type : null,
      MobileNo: ModelData.MobileNo ? ModelData.MobileNo : null,
      EmailId: ModelData.EmailId ? ModelData.EmailId : null,
      EventName: ModelData.EventName ? ModelData.EventName : null,
    }
    const url = environment.marketingApiUrl + `api/RegistrationforWebinar`;
    return this.http.post(url, data).pipe(map(x => x), take(1));
  }

  insertVirtualDetails = (ModelData) => {
    let data = {
      userId: ModelData.Id ? ModelData.Id : null,
      entityType: ModelData.UserType ? ModelData.UserType : null,
      truPayVirtualId: ModelData.TRUPayVirtualId ? ModelData.TRUPayVirtualId : null,
      withoutTaxAmount: ModelData.Amount ? ModelData.Amount : null,
      panNumber: ModelData.PanNumber ? ModelData.PanNumber : null,
      entityId: ModelData.ReferredById ? ModelData.ReferredById : null,
      module: ModelData.Module ? ModelData.Module : null,
      cpFullName: ModelData.CPName ? ModelData.CPName : null,
    }
    const url = environment.empApiUrl + `api/TRUPay/AcountingCPAmountInsert/UserId,EntityId,UserType`;
    return this.http.post(url, data).pipe(map(x => x), take(1));
  }
  GetCountry=()=>{
    const url = `${environment.executionApiUrl}api/Common/GetDropdownForLocalStorage`;
    return this.http.get(url).pipe(map(x => x));
  }
}
