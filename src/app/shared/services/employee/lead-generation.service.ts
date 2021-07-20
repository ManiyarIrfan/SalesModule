import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LeadGenerationService {

  constructor(private http: HttpClient) { }
  getMobileValidation = (mobile) => {
    const url = `${environment.apiUrl}/api/IsDuplicate/mobileNo?MobileNo=${mobile}`;
    return this.http.get(url).pipe(map(x => x));
  }
  getEmailValidation = (email) => {
    const url = `${environment.apiUrl}/api/IsDuplicate/emailId?EmailId=${email}`;
    return this.http.get(url).pipe(map(x => x));
  }
  getSourceCampaign = (user, Type) => {
    const url = `${environment.empApiUrl}api/EmployeeAdmin/GetSourceCampaign/UserId,EntityId,UserType,Type?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}&Type=${Type ? Type : ''}&TenantId=${user.TenantId}`;
    return this.http.get(url).pipe(map(x => x));
  }
  checkDuplicateNo = (number) => {
    const url = `${environment.apiUrl}api/IsDuplicate/PriorityNo?PriorityNo=${number}`;
    return this.http.get(url).pipe(map(x => x));
  }
  GetPreferredLocationOnCity = (user, PreferredCityName) => {
    const url = `${environment.apiUrl}api/ProjectDetails/GetLocationByCity/UserId,EntityId,UserType,City?City=${PreferredCityName}&TenantId=${user.TenantId}`;
    return this.http.get(url).pipe(map(x => x));
  }
  GetProjectListOnSelectedLocation = (user, PreferredAreaName) => {
    const url = `${environment.apiUrl}api/ProjectDetails/GetProjectNames/UserId,EntityId,UserType,location?TenantId=${user.TenantId}&location=${PreferredAreaName}`;
    return this.http.get(url).pipe(map(x => x));
  }
  getAllSalesEmployeeOnSelected = (user, Role) => {
    const url = `${environment.empApiUrl}api/GetAllEmployeeNames_ByRole?TenantId=${user.TenantId}&Role=${Role}`;
    return this.http.get(url).pipe(map(x => x));
  }
  userOnMobile = (user, mobileNo) => {
    const url = `${environment.empApiUrl}api/IsAllReadyExists/UserId,EntityId,UserType?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}&Search=${mobileNo}`;
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
  InsertEOIFormDetails = (refModel, user, file) => {
    let data = {
      referralModelEOI: {
        entityId: user.EntityId,
        userType: user.UserType,
        firstName: refModel.refFirst,
        lastName: refModel.refLast,
        addressLine1: refModel.refAddress1 ? refModel.refAddress1 : '',
        city: refModel.refCity,
        state: refModel.refState,
        countryCode: refModel.refCountryCode,
        pincode: refModel.PinCode,
        mobileNo: refModel.refMobileNo,
        alternateNo: refModel.refAlternate ? refModel.refAlternate : '',
        email: refModel.refEmail ? refModel.refEmail : refModel.refMobileNo + '@trurealty.in',
        occupation: refModel.refOccupation ? refModel.refOccupation : '',
        relationship: refModel.refRelationship ? refModel.refRelationship : '',
        requirementType: refModel.requireType,
        budget: refModel.budget,
        plotSize: refModel.PlotSize,
        bhk: refModel.bhk,
        preferredCity: refModel.preCity,
        visitSite: refModel.visitSite ? refModel.visitSite : '',
        preferredDate: refModel.preDate,
        preferredTime: refModel.preTime,
        preferredArea: refModel.PreferredArea,
        preferredProject: refModel.PreferredProject,
        commercialOption: refModel.comm_options,
        itOption: refModel.it_options,
        source: refModel.Source,
        campaign: refModel.Campaign,
        noOfSiteVisit: refModel.noOfsiteVisit,
        face2Face: refModel.face2Face,
        possession: refModel.Possession,
        salesAgentEmpAssigned: refModel.SalesAgentAssignedId,
        referredByName: refModel.refByName,
        id: user.UserId,
        createdOn: refModel.createdOn ? refModel.createdOn : null,
        panNo: refModel.RefPanNo,
        adharCard: refModel.AdharNo,
        beneficiaryName: refModel.bName,
        bankName: refModel.BankName,
        branch: refModel.Branch,
        accountNo: refModel.AccountNo,
        ifscCode: refModel.IFSC,
        acType: refModel.AccountType,
        priorityNo: refModel.Priority,
        referral1_Name: refModel.rName1,
        referral1_ContactNo: refModel.rMobile1,
        referral2_Name: refModel.rName2,
        referral2_ContactNo: refModel.rMobile2,
        tokenAmount_Bankname: refModel.TokenBankName,
        tokenAmount_ChequeNo: refModel.TokenChequeNo,
        token_Amount: refModel.TokenAmount,
        token_ChequeDate: refModel.TokenChequeDate
      },
      fileAttachment: file
    }
    let url = `${environment.apiUrl}api/Referral/Insert_EOI/UserId,UserType?UserId=${user.UserId}&UserType=${user.UserType}&DeviceDetails=${user.DeviceDetails}`;
    return this.http.post(url, data).pipe(map(x => x), take(1));
  }
  InsertReferralGenerationDetails = (refModel, user) => {
    let data = {
      UserType: user.UserType,
      Id: user.UserId,
      EntityId: user.EntityId,
      Title: refModel.refTitle,
      FirstName: refModel.refFirst,
      LastName: refModel.refLast,
      AddressLine1: refModel.refAddress1 ? refModel.refAddress1 : '',
      City: refModel.refCity,
      MobileNo: refModel.refMobileNo,
      AlternateNo: refModel.refAlternate ? refModel.refAlternate : '',
      Email: refModel.refEmail ? refModel.refEmail : refModel.refMobileNo + '@trurealty.in',
      Occupation: refModel.refOccupation ? refModel.refOccupation : '',
      Relationship: refModel.refRelationship ? refModel.refRelationship : '',
      RequirementType: refModel.requireType,
      Budget: refModel.budget,
      Bhk: refModel.bhk,
      CommercialOption: refModel.comm_options,
      ITOption: refModel.it_options,
      PreferredCity: refModel.preCity,
      VisitSite: refModel.visitSite ? refModel.visitSite : '',
      PreferredDate: refModel.preDate,
      PreferredTime: refModel.preTime,
      source: refModel.Source,
      noOfSiteVisit: refModel.noOfsiteVisit,
      face2Face: refModel.face2Face,
      preferredarea: refModel.PreferredArea,
      preferredproject: refModel.PreferredProject,
      Possession: refModel.Possession,
      enquiryId: refModel.EnquiryId,
      salesAgentEmpAssigned: refModel.SalesAgentAssignedId,
      campaign: refModel.Campaign,
      referredByName: refModel.refByName,
      createdOn: refModel.createdOn ? refModel.createdOn : null,
      countryCode: refModel.refCountryCode,
      plotSize: refModel.PlotSize
    }
    let url = `${environment.apiUrl}api/Referral/Insert/UserId,UserType?UserId=${user.UserId}&UserType=${user.UserType}&DeviceDetails=${user.DeviceDetails}`;
    return this.http.post(url, data).pipe(map(x => x), take(1));
  }
  updateReferralGenerationDetails = (refModel, user, file) => {
    let data = {
      eOIReferralUpdateModel: {
        beneficiaryName: refModel.bName,
        bankName: refModel.BankName,
        branch: refModel.Branch,
        accountNo: refModel.AccountNo,
        ifscCode: refModel.IFSC,
        acType: refModel.AccountType,
        priorityNo: refModel.Priority,
        referral1_Name: refModel.rName1,
        referral1_ContactNo: refModel.rMobile1,
        referral2_Name: refModel.rName2,
        referral2_ContactNo: refModel.rMobile2,
        tokenAmount_Bankname: refModel.TokenBankName,
        tokenAmount_ChequeNo: refModel.TokenChequeNo,
        token_Amount: refModel.TokenAmount,
        token_ChequeDate: refModel.TokenChequeDate,
        referralId: refModel.ReferralId,
        id: user.UserId,
        AddressLine1: refModel.refAddress1 ? refModel.refAddress1 : '',
        City: refModel.refCity ? refModel.refCity : '',
        AlternateNo: refModel.refAlternate ? refModel.refAlternate : '',
        RequirementType: refModel.requireType,
        Budget: refModel.budget,
        Bhk: refModel.bhk,
        CommercialOption: refModel.comm_options,
        ITOption: refModel.it_options,
        PreferredCity: refModel.preCity,
        preferredarea: refModel.PreferredArea,
        preferredproject: refModel.PreferredProject,
        countryCode: refModel.refCountryCode,
        campaign: refModel.Campaign,
        pincode: refModel.PinCode,
        panNo: refModel.RefPanNo,
        adharCard: refModel.AdharNo,
        state: refModel.refState,
        occupation: refModel.refOccupation ? refModel.refOccupation : '',
        possession: refModel.Possession,
        plotSize: refModel.PlotSize
      },
      fileAttachment: file
    }
    let url = `${environment.apiUrl}api/Referral/ReferralEOIUpdate/UserId,UserType?UserId=${user.UserId}&UserType=${user.UserType}&DeviceDetails=${user.DeviceDetails}`;
    return this.http.put(url, data).pipe(map(x => x), take(1));
  }

  insertInteractionStatus = (user, leadinfoDetails, EnquiryDetails, interactiontype) => {
    let data = {
      Id: user.UserId,
      UserType: EnquiryDetails.UserType,
      creatorId: user.EntityId,
      creatorUserType: user.UserType,
      entityId: EnquiryDetails.EnquiryId,
      details: leadinfoDetails.Details,
      followUpRequired: leadinfoDetails.followUp,
      interactionType: interactiontype
    }
    let url = `${environment.empApiUrl}api/Interaction/Insert/UserId,EntityId,UserType?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}&TenantId=${user.TenantId}`;
    return this.http.post(url, data).pipe(map(x => x, take(1)));
  }

  siteVisitInsert = (user, referralDetails) => {
    const data = {
      id: user.UserId,
      referralId: referralDetails.ReferralId ? referralDetails.ReferralId : null,
      projectId: referralDetails.PreferredProjectId ? referralDetails.PreferredProjectId : null
    }
    const url = `${environment.empApiUrl}api/TRUPay/InsertSVRecord?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}`;
    return this.http.post(url, data).pipe(map(x => x, take(1)));
  }

  paymentlinkForEOI = (user, referralDetails) => {
    const data = {
      customer_name: referralDetails.ReferralName ? referralDetails.ReferralName : null,
      customer_Mobile: referralDetails.ReferralNo ? referralDetails.ReferralNo : null,
      customer_email: referralDetails.ReferralEmail ? referralDetails.ReferralEmail : null,
      amount: referralDetails.TokenAmount ? referralDetails.TokenAmount : null,
      currency: referralDetails.Currency ? referralDetails.Currency : null,
      description: referralDetails.Description ? referralDetails.Description : null,
      receipt: referralDetails.EntityId ? referralDetails.EntityId : null,
      expire_by: null,
      id: user.UserId ? user.UserId : null
    }
    const url = `${environment.empApiUrl}api/TRUPay/RazorpayCreatePaymentLink/UserId,EntityId,UserType?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}`;
    return this.http.post(url, data).pipe(map(x => x, take(1)));
  }

  insertInVirtualWallet = (user, leadDetails, input) => {
    const data = {
      entityId: leadDetails.EntityId ? leadDetails.EntityId : null,
      userType: leadDetails.UserType ? leadDetails.UserType : null,
      transactionId: leadDetails.EOIId ? leadDetails.EOIId : null,
      transactionType: leadDetails.TransactionType ? leadDetails.TransactionType : null,
      amount: leadDetails.TokenAmount ? leadDetails.TokenAmount : 0,
      tenantId: user.TenantId,
      id: user.UserId,
      input
    }
    const url = `${environment.empApiUrl}api/TRUPay/InsertVirtualWallet?UserId=${user.UserId}&EntityId=${user.EntityId}&UserType=${user.UserType}`;
    return this.http.post(url, data).pipe(map(x => x, take(1)));

  }
}
