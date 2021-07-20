export interface IleadinfoDetails {
    ReferralStatus: string;
    PreferredProject: string;
    TReferralId: number;
    Name: string;
    FirstName: string;
    LastName: string;
    SalesAgentAssignedId: number;
    Source: string;
    CreatedOn: Date;
    ReferredBy: string;
    IncentivePraposed: string;
    Organization: string;
    AlternateNo: string;
    AlternateEmail: string;
    Dob: string;
    AddressLine1: string;
    ProjectVisited: string;
    ReengagedSource: string;
    ReengagedSubSource: string;
    ReengagedCampaign: string;
    SalesAgentAssinged: string;
    FollowUpDate: string;
    FollowUp: string;
    FollowUpStatus: string;
    Agenda: string;
    FollowUpType: string;
    followUp: string;
    followUpType: string;
    FollowUPTime: string;
    remarks: string;
    length: number;
    StatusChangeReason: string;
    MobileNo: number;
    PresalesAgentAssigned: number;
    PreSalesEmployee: string;
    StoreStatus: string;
    salesAgentAssinged: string;
    IsActive: boolean;
    IsReferralActive: boolean;
    Firstname:string;
}
export interface IemployeeName {
    Email: string;
    EmployeeId: number;
    Id: number;
    IsActive: true;
    MobileNo: number;
    Name: string;
}
export interface IselectedPreSalesEmployeeName {
    Email: string;
    EmployeeId: number;
    Id: number;
    IsActive: boolean;
    MobileNo: number;
    Name: string;
}
export interface Ileadinfo {
    name: string;
    Id: number;
    referralStatus: string;
    AlternateEmail: string;
}
export interface IinteractionModel {
    Details: string;
    interactionType: string;
    followUp: string;
}
export interface IcallCheckList {
    Answer: string;
    SubTag: string;
    Tag: string;
    TagId: number;
}
export interface Iemailmodel {
    Email: string;
    UserType: string;
    EnquiryId: number;
    AlternateEmail: string;
}
export interface ImessageModel {
    Template: string;
}
export interface IsiteVisitModel {
    PreferredProject: string;
    preDate: Date;
    Details: string;
}
